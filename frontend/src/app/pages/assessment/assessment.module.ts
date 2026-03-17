import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AssessmentPageRoutingModule } from './assessment-routing.module';
import { AssessmentPage } from './assessment.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AssessmentPageRoutingModule
  ],
  declarations: [AssessmentPage]
})
export class AssessmentPageModule { }
