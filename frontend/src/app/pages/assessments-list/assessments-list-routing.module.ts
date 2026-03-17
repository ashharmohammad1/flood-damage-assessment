import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AssessmentsListPage } from './assessments-list.page';

const routes: Routes = [
  {
    path: '',
    component: AssessmentsListPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AssessmentsListPageRoutingModule { }
