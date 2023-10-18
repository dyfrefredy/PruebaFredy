import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchFileComponent } from './search-file/search-file.component';
import { UploadFileComponent } from './upload-file/upload-file.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'CBP'
    },
    children: [
      {
        path: '',
        redirectTo: 'CBP-dashboard'
      },
      {
        path: 'upload-file',
        component: UploadFileComponent,
        data: {
          title: 'module.CBP.moduleName', translate: true
        }
      },
      {
        path: 'search-file',
        component: SearchFileComponent,
        data: {
          title: 'module.CBP.moduleName', translate: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CBPRoutingModule {}
