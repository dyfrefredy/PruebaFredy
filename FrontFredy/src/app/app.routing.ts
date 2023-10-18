import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GuardService } from './services/guard.service';
import { P404Component } from './views/error/404.component';
import { P500Component } from './views/error/500.component';
import { RegisterComponent } from './views/register/register.component';

// Import Containers
import { HomeLayoutComponent, AdminLayoutComponent } from './containers';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'home/home',
    pathMatch: 'full',
  },
  {
    path: 'administration',
    redirectTo: 'administration/user',
    pathMatch: 'full',
  },
  {
    path: 'state',
    redirectTo: 'home/home',
    pathMatch: 'full',
  },
  {
    path: '404',
    component: P404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: P500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: '',
    component: HomeLayoutComponent,
    /*data: {
      title: 'CargoApps'
    },*/
    children: [
      {
        path: 'home',
        loadChildren: () => import('./views/home/home.module').then(m => m.HomeModule),
      },
    ]
  },
  {
    path: '',
    component: AdminLayoutComponent,
    data: {
      title: 'module.home.moduleName', translate: true
    },
    children: [
      {
        path: 'administration',
        loadChildren: () => import('./views/administration/admin.module').then(m => m.AdminModule),
        canActivate:[GuardService]
      },
      {
        path: 'customer-service',
        loadChildren: () => import('./views/customer-service/customer-service.module').then(m => m.CustomerServiceModule),
        canActivate:[GuardService]
      },
      {
        path: 'pharma',
        loadChildren: () => import('./views/pharma/pharma.module').then(m => m.PharmaModule),
        canActivate:[GuardService]
      },
      {
        path: 'claims',
        loadChildren: () => import('./views/claims/claims.module').then(m => m.ClaimsModule),
        canActivate:[GuardService]
      },
      {
        path: 'import',
        loadChildren: () => import('./views/import/import.module').then(m => m.ImportModule),
      },
      {
        path: 'process',
        loadChildren: () => import('./views/process/process.module').then(m => m.ProcessModule),
      },
      {
        path: 'CBP',
        loadChildren: () => import('./views/CBP/CBP.module').then(m => m.CBPModule),
        canActivate:[GuardService]
      }
    ]
  },
  { path: '**', component: P404Component }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}
