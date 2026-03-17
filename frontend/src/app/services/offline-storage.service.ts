import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { BehaviorSubject, Observable } from 'rxjs';

export interface FarmAssessment {
  id?: number;
  address: string;
  latitude: number;
  longitude: number;
  conditionStatus: string; // 'GOOD', 'MODERATE', 'BAD'
  totalChickens: number;
  notes?: string;
  assessor: string;
  synced?: boolean;
  photos?: Photo[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Photo {
  id?: number;
  fileName: string;
  filePath: string;
  contentType: string;
  capturedAt?: string;
  description?: string;
  base64Data?: string; // For offline storage
  uploaded?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class OfflineStorageService {

  private storageReady = false;
  private assessmentsSubject = new BehaviorSubject<FarmAssessment[]>([]);
  public assessments$ = this.assessmentsSubject.asObservable();

  constructor(private storage: Storage) {
    this.initStorage();
  }

  async initStorage() {
    await this.storage.create();
    this.storageReady = true;
    await this.loadAssessments();
  }

  // Assessment Management
  async saveAssessment(assessment: FarmAssessment, localId?: number): Promise<FarmAssessment> {
    const assessments = await this.getLocalAssessments();
    console.log('Saving assessment:', assessment);
    console.log('with localId:', localId);
    if (assessment.id) {
      const index = assessments.findIndex(a => a.id === assessment.id || a.id == localId);
      if (index > -1) {
        assessments[index] = assessment;
      }
    } else {
      assessment.id = Date.now(); // Generate temporary ID
      assessments.push(assessment);
    }

    await this.storage.set('assessments', assessments);
    await this.loadAssessments();
    return assessment;
  }

  async getLocalAssessments(): Promise<FarmAssessment[]> {
    const assessments = await this.storage.get('assessments');
    return assessments || [];
  }

  async getAssessmentById(id: number): Promise<FarmAssessment | null> {
    const assessments = await this.getLocalAssessments();
    return assessments.find(a => a.id === id) || null;
  }

  async deleteAssessment(id: number): Promise<void> {
    const assessments = await this.getLocalAssessments();
    const filtered = assessments.filter(a => a.id !== id);
    await this.storage.set('assessments', filtered);
    await this.loadAssessments();
  }

  async getUnSyncedAssessments(): Promise<FarmAssessment[]> {
    const assessments = await this.getLocalAssessments();
    return assessments.filter(a => !a.synced);
  }

  async markAsSynced(id: number): Promise<void> {
    const assessment = await this.getAssessmentById(id);
    if (assessment) {
      assessment.synced = true;
      await this.saveAssessment(assessment);
    }
  }

  // Photo Management
  async savePhoto(assessmentId: number, photo: Photo): Promise<Photo> {
    const assessment = await this.getAssessmentById(assessmentId);
    if (assessment) {
      if (!assessment.photos) {
        assessment.photos = [];
      }
      if (!photo.id) {
        photo.id = Date.now();
      }
      assessment.photos.push(photo);
      await this.saveAssessment(assessment);
    }
    return photo;
  }

  async getPhotosByAssessment(assessmentId: number): Promise<Photo[]> {
    const assessment = await this.getAssessmentById(assessmentId);
    return assessment?.photos || [];
  }

  async deletePhoto(assessmentId: number, photoId: number): Promise<void> {
    const assessment = await this.getAssessmentById(assessmentId);
    if (assessment && assessment.photos) {
      assessment.photos = assessment.photos.filter(p => p.id !== photoId);
      await this.saveAssessment(assessment);
    }
  }

  // Private methods
  private async loadAssessments() {
    const assessments = await this.getLocalAssessments();
    this.assessmentsSubject.next(assessments);
  }

  // Clear all data
  async clearAllData(): Promise<void> {
    await this.storage.remove('assessments');
    this.assessmentsSubject.next([]);
  }
}
