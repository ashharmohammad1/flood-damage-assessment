import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

export interface FarmAssessmentDTO {
  id?: number;
  address: string;
  latitude: number;
  longitude: number;
  conditionStatus: string;
  totalChickens: number;
  notes?: string;
  assessor: string;
  synced?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:8080/api';
  private connectionStatus = new BehaviorSubject<boolean>(navigator.onLine);
  public connectionStatus$ = this.connectionStatus.asObservable();

  constructor(private http: HttpClient) {
    window.addEventListener('online', () => this.setOnline());
    window.addEventListener('offline', () => this.setOffline());
  }

  // Assessments
  createAssessment(assessment: FarmAssessmentDTO): Observable<FarmAssessmentDTO> {
    return this.http.post<FarmAssessmentDTO>(`${this.apiUrl}/assessments`, assessment)
      .pipe(
        tap(response => console.log('Assessment created:', response)),
        catchError(error => {
          console.error('Error creating assessment:', error);
          throw error;
        })
      );
  }

  getAssessment(id: number): Observable<FarmAssessmentDTO> {
    return this.http.get<FarmAssessmentDTO>(`${this.apiUrl}/assessments/${id}`);
  }

  updateAssessment(id: number, assessment: FarmAssessmentDTO): Observable<FarmAssessmentDTO> {
    return this.http.put<FarmAssessmentDTO>(`${this.apiUrl}/assessments/${id}`, assessment);
  }

  getAllAssessments(): Observable<FarmAssessmentDTO[]> {
    return this.http.get<FarmAssessmentDTO[]>(`${this.apiUrl}/assessments`);
  }

  getAssessmentsByAssessor(assessor: string): Observable<FarmAssessmentDTO[]> {
    return this.http.get<FarmAssessmentDTO[]>(`${this.apiUrl}/assessments/assessor/${assessor}`);
  }

  deleteAssessment(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/assessments/${id}`);
  }

  markAsSynced(id: number): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/assessments/${id}/sync`, {});
  }

  // Photos
  uploadPhoto(assessmentId: number, file: File, description?: string, capturedAt?: string): Observable<any> {
    const formData = new FormData();
    formData.append('assessmentId', assessmentId.toString());
    formData.append('file', file);
    if (description) formData.append('description', description);
    if (capturedAt) formData.append('capturedAt', capturedAt);

    return this.http.post(`${this.apiUrl}/photos`, formData);
  }

  getPhotosByAssessment(assessmentId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/photos/assessment/${assessmentId}`);
  }

  deletePhoto(photoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/photos/${photoId}`);
  }

  // Connectivity
  isOnline(): boolean {
    return this.connectionStatus.value;
  }

  private setOnline() {
    console.log('Network connected');
    this.connectionStatus.next(true);
  }

  private setOffline() {
    console.log('Network disconnected');
    this.connectionStatus.next(false);
  }
}
