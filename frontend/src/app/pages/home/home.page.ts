import { Component, OnInit } from '@angular/core';
import { OfflineStorageService } from '../../services/offline-storage.service';
import { SyncService } from '../../services/sync.service';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  assessmentCount = 0;
  unSyncedCount = 0;
  assessments$: Observable<any>;
  syncing$ = this.syncService.syncing$;
  syncProgress$ = this.syncService.syncProgress$;

  constructor(
   private navctrl: NavController,
    private offlineStorage: OfflineStorageService,
    private syncService: SyncService
  ) {
    this.assessments$ = this.offlineStorage.assessments$;
  }

  async ngOnInit() {
    await this.loadCounts();
  }

  async loadCounts() {
    const assessments = await this.offlineStorage.getLocalAssessments();
    this.assessmentCount = assessments.length;
    this.unSyncedCount = await this.syncService.getUnSyncedCount();
  }

  goToNewAssessment() {
    this.navctrl.navigateRoot(['/assessment']);
  }

  goToAssessmentsList() {
    this.navctrl.navigateRoot(['/assessments']);
  }

  goToSync() {
    this.navctrl.navigateRoot(['/sync']);
  }

  async quickSync() {
    try {
      const result = await this.syncService.syncAllAssessments();
      await this.loadCounts();
      console.log('Sync result:', result);
    } catch (error) {
      console.error('Sync error:', error);
    }
  }
}
