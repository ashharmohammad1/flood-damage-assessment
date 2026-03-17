import { Injectable } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { Capacitor } from '@capacitor/core';
import { BehaviorSubject } from 'rxjs';

export interface CameraPhoto {
  path: string;
  webPath: string;
  blob?: Blob;
  base64?: string;
  timestamp: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PhotoService {

  private photosSubject = new BehaviorSubject<CameraPhoto[]>([]);
  public photos$ = this.photosSubject.asObservable();

  constructor() {
    this.requestPermissions();
  }

  async requestPermissions() {
    try {
      const permission = await Camera.requestPermissions({
        permissions: ['camera', 'photos']
      });
      console.log('Camera permissions:', permission);
    } catch (error) {
      console.error('Error requesting camera permissions:', error);
    }
  }

  async takePhoto(): Promise<CameraPhoto> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Camera,
        promptLabelHeader: 'Take Photo',
        promptLabelCancel: 'Cancel',
        promptLabelPicture: 'From Photos',
        promptLabelPhoto: 'Take Photo'
      });

      const photo: CameraPhoto = {
        path: image.path || '',
        webPath: image.webPath || '',
        base64: image.base64String || '',
        timestamp: new Date()
      };

      return photo;
    } catch (error) {
      console.error('Error taking photo:', error);
      throw error;
    }
  }

  async pickImage(): Promise<CameraPhoto> {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Base64,
        source: CameraSource.Photos,
        promptLabelHeader: 'Select Photo',
        promptLabelCancel: 'Cancel',
        promptLabelPicture: 'From Photos',
        promptLabelPhoto: 'Take Photo'
      });

      const photo: CameraPhoto = {
        path: image.path || '',
        webPath: image.webPath || '',
        base64: image.base64String || '',
        timestamp: new Date()
      };

      return photo;
    } catch (error) {
      console.error('Error picking image:', error);
      throw error;
    }
  }

  async convertBase64ToBlob(base64: string, contentType: string): Promise<Blob> {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
  }

  addPhoto(photo: CameraPhoto) {
    const photos = this.photosSubject.value;
    photos.push(photo);
    this.photosSubject.next([...photos]);
  }

  removePhoto(index: number) {
    const photos = this.photosSubject.value;
    photos.splice(index, 1);
    this.photosSubject.next([...photos]);
  }

  clearPhotos() {
    this.photosSubject.next([]);
  }

  getPhotos(): CameraPhoto[] {
    return this.photosSubject.value;
  }
}
