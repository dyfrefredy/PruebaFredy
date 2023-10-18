import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ImportDian1166Component } from './import-dian-1166/import-dian-1166.component';
import { ImportMuiscaComponent } from './import-muisca/import-muisca.component';
import { ImportSkychainComponent } from './import-skychain/import-skychain.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Importacion'
    },
    children: [
      {
        path: '',
        redirectTo: 'import-muisca'
      },
      {
        path: 'import-muisca',
        component: ImportMuiscaComponent,
        data: {
          title: 'Importar MUISCA'
        }
      },
      {
        path: 'import-skychain',
        component: ImportSkychainComponent,
        data: {
          title: 'Importar Skychain'
        }
      },
      {
        path: 'import-diam-166',
        component: ImportDian1166Component,
        data: {
          title: 'Importar Form DIAN 1166'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ImportRoutingModule {}
