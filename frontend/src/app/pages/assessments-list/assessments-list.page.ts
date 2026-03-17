import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OfflineStorageService } from '../../services/offline-storage.service';
import { Observable } from 'rxjs';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-assessments-list',
  templateUrl: 'assessments-list.page.html',
  styleUrls: ['assessments-list.page.scss'],
})
export class AssessmentsListPage implements OnInit {

  assessments$: Observable<any>;
  filteredAssessments: any[] = [];
  filterCondition = '';

  constructor(
   private navctrl: NavController, 
    private offlineStorage: OfflineStorageService
  ) {
    this.assessments$ = this.offlineStorage.assessments$;
  }

  ngOnInit() {
    this.assessments$.subscribe(assessments => {
      this.filterAssessments(assessments);
    });
  }

  filterAssessments(assessments: any[]) {
    if (this.filterCondition === '') {
      this.filteredAssessments = assessments;
    } else {
      this.filteredAssessments = assessments.filter(a => a.conditionStatus === this.filterCondition);
    }
  }

  onFilterChange(event: any) {
    this.filterCondition = event.detail.value;
    this.assessments$.subscribe(assessments => {
      this.filterAssessments(assessments);
    });
  }

  viewAssessment(id: number) {
    this.navctrl.navigateRoot(['/assessment', id]);
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
}
