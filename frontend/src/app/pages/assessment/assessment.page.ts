import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NavController, ToastController } from '@ionic/angular';
import { GeolocationService, Location } from '../../services/geolocation.service';
import { OfflineStorageService, Photo } from '../../services/offline-storage.service';
import { PhotoService, CameraPhoto } from '../../services/photo.service';

@Component({
  selector: 'app-assessment',
  templateUrl: 'assessment.page.html',
  styleUrls: ['assessment.page.scss'],
})
export class AssessmentPage implements OnInit {

  assessmentForm: FormGroup;
  currentLocation: Location | null = null;
  photos: CameraPhoto[] = [];
  loadingLocation = false;
  submitting = false;

  conditionOptions = [
    { value: 'GOOD', label: 'Good' },
    { value: 'MODERATE', label: 'Moderate' },
    { value: 'BAD', label: 'Bad' }
  ];

  constructor(
    private formBuilder: FormBuilder,
    private navctrl: NavController,
    private toastController: ToastController,
    private geolocation: GeolocationService,
    private offlineStorage: OfflineStorageService,
    private photoService: PhotoService
  ) {
    this.assessmentForm = this.createForm();
  }

  ngOnInit() {
    this.getCurrentLocation();
  }

  createForm(): FormGroup {
    return this.formBuilder.group({
      address: ['', Validators.required],
      latitude: ['', Validators.required],
      longitude: ['', Validators.required],
      conditionStatus: ['GOOD', Validators.required],
      totalChickens: ['', [Validators.required, Validators.min(0)]],
      notes: [''],
      assessor: ['', Validators.required]
    });
  }

  async getCurrentLocation() {
    this.loadingLocation = true;
    try {
      const location = await this.geolocation.getCurrentLocation();
      this.currentLocation = location;
      this.assessmentForm.patchValue({
        latitude: location.latitude.toFixed(6),
        longitude: location.longitude.toFixed(6)
      });
      this.loadingLocation = false;
    } catch (error) {
      this.loadingLocation = false;
      this.presentToast('Unable to get location. Please provide manually.', 'warning');
      console.error('Error getting location:', error);
    }
  }

  async takePhoto() {
    try {
      const photo = await this.photoService.takePhoto();
      this.photos.push(photo);
    } catch (error) {
      this.presentToast('Failed to take photo', 'danger');
      console.error('Error taking photo:', error);
    }
  }

  async selectPhoto() {
    try {
      const photo = await this.photoService.pickImage();
      this.photos.push(photo);
    } catch (error) {
      this.presentToast('Failed to select photo', 'danger');
      console.error('Error selecting photo:', error);
    }
  }

  removePhoto(index: number) {
    this.photos.splice(index, 1);
  }

  async submitAssessment() {
    if (!this.assessmentForm.valid) {
      this.presentToast('Please fill all required fields', 'warning');
      return;
    }

    this.submitting = true;

    try {
      const formValue = this.assessmentForm.value;
      
      // Convert CameraPhoto[] to Photo[]
      const photos: Photo[] = this.photos.map((cameraPhoto: CameraPhoto, index: number) => ({
        fileName: `photo_${Date.now()}_${index}.jpg`,
        filePath: cameraPhoto.path || cameraPhoto.webPath || '',
        contentType: 'image/jpeg',
        capturedAt: cameraPhoto.timestamp?.toISOString(),
        base64Data: cameraPhoto.base64,
        uploaded: false
      }));
      
      const assessment = {
        address: formValue.address,
        latitude: parseFloat(formValue.latitude),
        longitude: parseFloat(formValue.longitude),
        conditionStatus: formValue.conditionStatus,
        totalChickens: parseInt(formValue.totalChickens),
        notes: formValue.notes,
        assessor: formValue.assessor,
        synced: false,
        photos: photos,
        createdAt: new Date()
      };

      const savedAssessment = await this.offlineStorage.saveAssessment(assessment);
      
      this.submitting = false;
      this.presentToast('Assessment saved successfully', 'success');
      this.navctrl.navigateRoot(['/home']);
    } catch (error) {
      this.submitting = false;
      this.presentToast('Failed to save assessment', 'danger');
      console.error('Error saving assessment:', error);
    }
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    await toast.present();
  }
}
