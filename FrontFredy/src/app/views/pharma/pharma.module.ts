import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../ui.module';
import { PharmaRoutingModule } from './pharma-routing.module';
import { GuideDashboardComponent } from './guide-dashboard/guide-dashboard.component';
import { GuideAcceptanceComponent } from './guide-acceptance/guide-acceptance.component';
import { TrackAwbComponent } from './track-awb/track-awb.component';
import { GuideActiveComponent } from './guide-active/guide-active.component';
import { GuideNotifyComponent } from './guide-notify/guide-notify.component';
import { DynamicDialogModule } from 'primeng/dynamicdialog';
import { SpecialServiceOperationComponent } from './special-service-operation/special-service-operation.component';

@NgModule({
  imports: [
    FormsModule,
    UIModule,
    PharmaRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    DynamicDialogModule
  ],
  declarations: [
  GuideDashboardComponent,
  GuideAcceptanceComponent,
  TrackAwbComponent,
  GuideActiveComponent,
  GuideNotifyComponent,
  SpecialServiceOperationComponent]
})

export class PharmaModule { }
