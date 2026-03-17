import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { OfflineStorageService } from '../../services/offline-storage.service';
import { addIcons } from 'ionicons';
import { close, create } from 'ionicons/icons';

@Component({
  selector: 'app-assessment-detail',
  templateUrl: 'assessment-detail.page.html',
  styleUrls: ['assessment-detail.page.scss'],
})
export class AssessmentDetailPage implements OnInit {

  assessmentForm: FormGroup;
  assessmentId: number | null = null;
  assessment: any = null;
  isEditing = false;
  submitting = false;

  conditionOptions = [
    { value: 'GOOD', label: 'Good' },
    { value: 'MODERATE', label: 'Moderate' },
    { value: 'BAD', label: 'Bad' }
  ];

  constructor(
    private route: ActivatedRoute,
   private navctrl: NavController,
    private formBuilder: FormBuilder,
    private toastController: ToastController,
    private alertController: AlertController,
    private offlineStorage: OfflineStorageService
  ) {
    this.assessmentForm = this.createForm();
    addIcons({create, close})
  }

  ngOnInit() {
    this.loadAssessment();
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

  async loadAssessment() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.assessmentId = parseInt(id);
      const assessment = await this.offlineStorage.getAssessmentById(this.assessmentId);
      if (assessment) {
        this.assessment = assessment;
        this.assessmentForm.patchValue({
          address: assessment.address,
          latitude: assessment.latitude,
          longitude: assessment.longitude,
          conditionStatus: assessment.conditionStatus,
          totalChickens: assessment.totalChickens,
          notes: assessment.notes || '',
          assessor: assessment.assessor
        });
        this.assessmentForm.disable();
      } else {
        this.presentToast('Assessment not found', 'danger');
        this.navctrl.navigateRoot(['/assessments']);
      }
    }
  }

  enableEditing() {
    this.isEditing = true;
    this.assessmentForm.enable();
  }

  cancelEditing() {
    this.isEditing = false;
    this.assessmentForm.disable();
    this.loadAssessment();
  }

  async updateAssessment() {
    if (!this.assessmentForm.valid || !this.assessmentId) {
      this.presentToast('Please fill all required fields', 'warning');
      return;
    }

    this.submitting = true;

    try {
      const formValue = this.assessmentForm.value;
      const updated = {
        ...this.assessment,
        address: formValue.address,
        latitude: parseFloat(formValue.latitude),
        longitude: parseFloat(formValue.longitude),
        conditionStatus: formValue.conditionStatus,
        totalChickens: parseInt(formValue.totalChickens),
        notes: formValue.notes,
        assessor: formValue.assessor,
        synced: false,
        updatedAt: new Date()
      };

      await this.offlineStorage.saveAssessment(updated);
      this.assessment = updated;
      this.isEditing = false;
      this.assessmentForm.disable();
      this.submitting = false;
      this.presentToast('Assessment updated successfully', 'success');
    } catch (error) {
      this.submitting = false;
      this.presentToast('Failed to update assessment', 'danger');
      console.error('Error updating assessment:', error);
    }
  }

  async deleteAssessment() {
    const alert = await this.alertController.create({
      header: 'Delete Assessment',
      message: 'Are you sure you want to delete this assessment? This action cannot be undone.',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            if (this.assessmentId) {
              await this.offlineStorage.deleteAssessment(this.assessmentId);
              this.presentToast('Assessment deleted', 'success');
              this.navctrl.navigateRoot(['/assessments']);
            }
          }
        }
      ]
    });

    await alert.present();
  }

  async presentToast(message: string, color: string = 'primary') {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000,
      color: color
    });
    await toast.present();
  }

  getConditionColor(condition: string): string {
    switch (condition) {
      case 'GOOD':
        return 'success';
      case 'MODERATE':
        return 'warning';
      case 'BAD':
        return 'danger';
      default:
        return 'primary';
    }
  }

  getSyncBadgeColor(synced: boolean): string {
    return synced ? 'success' : 'warning';
  }

  getSyncLabel(synced: boolean): string {
    return synced ? 'Synced' : 'Pending';
  }

  getPhotoSrc(photo: any): string {
    if (photo?.base64Data) {
      if (photo.base64Data.startsWith('data:')) {
        return photo.base64Data;
      }
      const contentType = photo.contentType || 'image/jpeg';
      return `data:${contentType};base64,${photo.base64Data}`;
    }
    return photo?.filePath || '';
  }
}
