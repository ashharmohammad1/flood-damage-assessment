import { Injectable } from '@angular/core';
import { OfflineStorageService, FarmAssessment } from './offline-storage.service';
import { ApiService } from './api.service';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export interface SyncResult {
  success: boolean;
  message: string;
  synced: number;
  failed: number;
  failedIds: number[];
}

@Injectable({
  providedIn: 'root'
})
export class SyncService {

  private syncing = new BehaviorSubject<boolean>(false);
  public syncing$ = this.syncing.asObservable();

  private syncProgress = new BehaviorSubject<number>(0);
  public syncProgress$ = this.syncProgress.asObservable();

  constructor(
    private offlineStorage: OfflineStorageService,
    private apiService: ApiService
  ) {}

  async syncAllAssessments(): Promise<SyncResult> {
    this.syncing.next(true);
    this.syncProgress.next(0);

    try {
      const unsyncedAssessments = await this.offlineStorage.getUnSyncedAssessments();
      
      if (unsyncedAssessments.length === 0) {
        this.syncing.next(false);
        return {
          success: true,
          message: 'No assessments to sync',
          synced: 0,
          failed: 0,
          failedIds: []
        };
      }

      let syncedCount = 0;
      let failedCount = 0;
      const failedIds: number[] = [];

      for (let i = 0; i < unsyncedAssessments.length; i++) {
        const assessment = unsyncedAssessments[i];
        
        try {
          await this.syncAssessment(assessment).toPromise();
          syncedCount++;
        } catch (error) {
          failedCount++;
          if (assessment.id) {
            failedIds.push(assessment.id);
          }
          console.error(`Error syncing assessment ${assessment.id}:`, error);
        }

        // Update progress
        const progress = Math.round(((i + 1) / unsyncedAssessments.length) * 100);
        this.syncProgress.next(progress);
      }

      this.syncing.next(false);

      return {
        success: failedCount === 0,
        message: `Synced ${syncedCount} assessments${failedCount > 0 ? `, failed: ${failedCount}` : ''}`,
        synced: syncedCount,
        failed: failedCount,
        failedIds: failedIds
      };
    } catch (error) {
      this.syncing.next(false);
      throw error;
    }
  }

  private syncAssessment(assessment: FarmAssessment): Observable<any> {
    // If assessment has no server ID, create it
    if (assessment.synced === false) { // Temporary IDs are timestamps
      const dto = {
        id: assessment.id, // Include local ID for reference
        address: assessment.address,
        latitude: assessment.latitude,
        longitude: assessment.longitude,
        conditionStatus: assessment.conditionStatus,
        totalChickens: assessment.totalChickens,
        notes: assessment.notes || '',
        assessor: assessment.assessor
      };

      return this.apiService.createAssessment(dto).pipe(
        switchMap(response => {
          // Update local assessment with server ID
          const localId = assessment.id; // Store local ID before update
          assessment.id = response.id;
          return from(this.offlineStorage.saveAssessment(assessment, localId)).pipe(
            switchMap(() => this.uploadAssessmentPhotos(assessment)),
            switchMap(() => this.apiService.markAsSynced(response.id!)),
            switchMap(() => {
              assessment.synced = true;
              return from(this.offlineStorage.saveAssessment(assessment));
            })
          );
        })
      );
    } else {
      // Update existing assessment
      const dto = {
        id: assessment.id,
        address: assessment.address,
        latitude: assessment.latitude,
        longitude: assessment.longitude,
        conditionStatus: assessment.conditionStatus,
        totalChickens: assessment.totalChickens,
        notes: assessment.notes || '',
        assessor: assessment.assessor
      };
      if(assessment.id === undefined) {
        throw new Error('Assessment ID is required for syncing existing assessments');
      }
      return this.apiService.updateAssessment(assessment.id, dto).pipe(
        switchMap(() => {
          return from(this.offlineStorage.saveAssessment(assessment)).pipe(
            switchMap(() => this.uploadAssessmentPhotos(assessment)),
            switchMap(() => this.apiService.markAsSynced(assessment.id!)),
            switchMap(() => {
              assessment.synced = true;
              return from(this.offlineStorage.saveAssessment(assessment));
            })
          );
        })
      );
    }
  }

  private uploadAssessmentPhotos(assessment: FarmAssessment): Observable<void> {
    if (!assessment.id || !assessment.photos || assessment.photos.length === 0) {
      return of(undefined);
    }

    return from(this.uploadPhotosSequentially(assessment)).pipe(
      switchMap(() => from(this.offlineStorage.saveAssessment(assessment)).pipe(
        switchMap(() => of(undefined))
      ))
    );
  }

  private async uploadPhotosSequentially(assessment: FarmAssessment): Promise<void> {
    if (!assessment.id || !assessment.photos) {
      return;
    }

    for (const photo of assessment.photos) {
      if (photo.uploaded) {
        continue;
      }

      if (!photo.base64Data) {
        console.warn('Skipping photo upload due to missing base64 data', photo);
        continue;
      }

      const blob = this.convertBase64ToBlob(photo.base64Data, photo.contentType);
      const file = new File([blob], photo.fileName, { type: photo.contentType });

      await this.apiService.uploadPhoto(
        assessment.id,
        file,
        photo.description,
        photo.capturedAt
      ).toPromise();

      photo.uploaded = true;
    }
  }

  private convertBase64ToBlob(base64: string, contentType: string): Blob {
    const cleanedBase64 = base64.includes(',') ? base64.split(',')[1] : base64;
    const byteCharacters = atob(cleanedBase64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  async getUnSyncedCount(): Promise<number> {
    const unsynced = await this.offlineStorage.getUnSyncedAssessments();
    return unsynced.length;
  }
}
