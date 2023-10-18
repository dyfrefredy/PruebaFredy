import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuideMaterDetailComponent } from './guide-master-detail/guide-master-detail.component';
import { GuideMasterComponent } from './guide-master/guide-master.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Proceso'
    },
    children: [
      {
        path: '',
        redirectTo: 'guide-master'
      },
      {
        path: 'guide-master',
        component: GuideMasterComponent,
        data: {
          title: 'Guia Master'
        }
      },
      {
        path: 'guide-master-detail',
        component: GuideMaterDetailComponent,
        data: {
          title: 'Guia Master - Detalle'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProcessRoutingModule {}
