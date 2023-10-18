import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { HomeComponent } from './home/home.component';
import { HomeRoutingModule } from './home-routing.module';
import { UIModule } from '../../ui.module';
import { QuotationComponent } from './quotation/quotation.component';
import { CommonModule } from '@angular/common';
import { ModuleComponent } from './module/module.component';
import { SearchItineraryComponent } from './search-itinerary/search-itinerary.component';
import { ClaimMenuComponent } from './claim-menu/claim-menu.component';
import { ClaimComponent } from './claim-menu/claim/claim.component';
import { FetchClaimComponent } from './claim-menu/fetch-claim/fetch-claim.component';
import { ExternalUserComponent } from './externalUser/externalUser.component';
import { QuotationRejectedComponent } from './quotation-rejected/quotation-rejected.component';
import { Dropdown, DropdownModule } from 'primeng/dropdown';



@NgModule({
  imports: [
    FormsModule,
    HomeRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    UIModule,
    CommonModule,
    DropdownModule
  ],
  declarations: [
    HomeComponent,
    QuotationComponent,
    ModuleComponent,
    SearchItineraryComponent,
    QuotationRejectedComponent,
    ClaimMenuComponent,
    ClaimComponent,
    FetchClaimComponent,
    ExternalUserComponent
  ]
})
export class HomeModule { }
