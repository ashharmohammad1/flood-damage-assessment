import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { AssessmentsListPageRoutingModule } from './assessments-list-routing.module';
import { AssessmentsListPage } from './assessments-list.page';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    AssessmentsListPageRoutingModule
  ],
  declarations: [AssessmentsListPage]
})
export class AssessmentsListPageModule { }
