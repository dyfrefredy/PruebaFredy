import { TrackAwbComponent } from './track-awb/track-awb.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuideAcceptanceComponent } from './guide-acceptance/guide-acceptance.component';
import { GuideActiveComponent } from './guide-active/guide-active.component';
import { GuideDashboardComponent } from './guide-dashboard/guide-dashboard.component';
import { SpecialServiceOperationComponent } from './special-service-operation/special-service-operation.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Pharma'
    },
    children: [
      {
        path: '',
        redirectTo: 'guide-dashboard'
      },
      {
        path: 'guide-dashboard',
        component: GuideDashboardComponent,
        data: {
          title: 'Dashboard'
        }
      },
      {
        path: 'track-awb',
        component: TrackAwbComponent,
        data: {
          title: 'Track awb'
        }
      },
      {
        path: 'special-services-operation',
        component: SpecialServiceOperationComponent,
        data: {
          title: 'special services operation'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PharmaRoutingModule {}
