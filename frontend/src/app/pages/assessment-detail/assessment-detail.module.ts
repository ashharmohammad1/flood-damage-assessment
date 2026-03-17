import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssessmentDetailPageRoutingModule } from './assessment-detail-routing.module';
import { AssessmentDetailPage } from './assessment-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AssessmentDetailPageRoutingModule
  ],
  declarations: [AssessmentDetailPage]
})
export class AssessmentDetailPageModule { }
