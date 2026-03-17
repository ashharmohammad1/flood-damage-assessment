import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastController, AlertController, NavController } from '@ionic/angular';
import { SyncService, SyncResult } from '../../services/sync.service';
import { ApiService } from '../../services/api.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-sync',
  templateUrl: 'sync.page.html',
  styleUrls: ['sync.page.scss'],
})
export class SyncPage implements OnInit {

  syncing$ = this.syncService.syncing$;
  syncProgress$ = this.syncService.syncProgress$;
  connectionStatus$: Observable<boolean>;
  lastSyncTime: Date | null = null;
  syncResult: SyncResult | null = null;

  constructor(
   private navctrl: NavController,

    private toastController: ToastController,
    private alertController: AlertController,
    private syncService: SyncService,
    private apiService: ApiService
  ) {
    this.connectionStatus$ = this.apiService.connectionStatus$;
  }

  ngOnInit() {
    const lastSync = localStorage.getItem('lastSyncTime');
    if (lastSync) {
      this.lastSyncTime = new Date(lastSync);
    }
  }

  async performSync() {
    try {
      this.syncResult = await this.syncService.syncAllAssessments();
      localStorage.setItem('lastSyncTime', new Date().toISOString());
      this.lastSyncTime = new Date();
      
      if (this.syncResult.success) {
        this.presentAlert(
          'Sync Successful',
          `${this.syncResult.synced} assessment(s) synced successfully.`
        );
      } else {
        this.presentAlert(
          'Sync Completed with Errors',
          `Synced: ${this.syncResult.synced}\nFailed: ${this.syncResult.failed}\n\nFailed IDs: ${this.syncResult.failedIds.join(', ')}`
        );
      }
    } catch (error) {
      console.error('Sync error:', error);
      this.presentAlert('Sync Failed', 'An error occurred during sync. Please try again.');
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message: message,
      duration: 2000
    });
    await toast.present();
  }

  goHome() {
    this.navctrl.navigateRoot(['/home']);
  }
}
