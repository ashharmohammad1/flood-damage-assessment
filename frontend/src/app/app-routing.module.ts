import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'assessment',
    loadChildren: () => import('./pages/assessment/assessment.module').then(m => m.AssessmentPageModule)
  },
  {
    path: 'assessment/:id',
    loadChildren: () => import('./pages/assessment-detail/assessment-detail.module').then(m => m.AssessmentDetailPageModule)
  },
  {
    path: 'assessments',
    loadChildren: () => import('./pages/assessments-list/assessments-list.module').then(m => m.AssessmentsListPageModule)
  },
  {
    path: 'sync',
    loadChildren: () => import('./pages/sync/sync.module').then(m => m.SyncPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
