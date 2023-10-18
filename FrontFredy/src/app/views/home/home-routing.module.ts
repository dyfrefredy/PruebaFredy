import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClaimMenuComponent } from './claim-menu/claim-menu.component';
import { ClaimComponent } from './claim-menu/claim/claim.component';
import { FetchClaimComponent } from './claim-menu/fetch-claim/fetch-claim.component';
import { ExternalUserComponent } from './externalUser/externalUser.component';

import { HomeComponent } from './home/home.component';
import { ModuleComponent } from './module/module.component';
import { QuotationRejectedComponent } from './quotation-rejected/quotation-rejected.component';
import { QuotationComponent } from './quotation/quotation.component';
import { SearchItineraryComponent } from './search-itinerary/search-itinerary.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'module.home.moduleName', translate: true
    },
    children: [
      {
        path: '',
        redirectTo: 'home'
      },
      {
        path: 'home',
        component: HomeComponent,
        data: {
          title: 'Incio'
        }
      },
      {
        path: 'quotation',
        component: QuotationComponent,
        data: {
          title: 'module.quote.moduleName', translate: true
        }
      },
      {
        path: 'module',
        component: ModuleComponent,
        data: {
          title: 'Modulos'
        }
      },
      {
        path: 'searchItinerary',
        component: SearchItineraryComponent,
        data: {
          title: 'module.searchItinerary.moduleName', translate: true
        }
      },
      {
        path: 'claimMenu',
        component: ClaimMenuComponent,
        data: {
          title: 'module.directClaims.moduleName', translate: true
        }
      },
      {
        path: 'claim',
        component: ClaimComponent,
        data: {
          title: 'module.directClaims.moduleName', translate: true
        }
      },
      {
        path: 'fetch-claim',
        component: FetchClaimComponent,
        data: {
          title: 'module.directClaims.moduleName', translate: true
        }
      },
      {
        path: 'externalUser',
        component: ExternalUserComponent,
        data: {
          title: 'module.externalUser.moduleName', translate: true
        }
      },
      {
        path: 'quotation-rejected/:id',
        component: QuotationRejectedComponent,
        data: {
          title: 'module.quote.quotation.quotationRejected', translate: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule {}
