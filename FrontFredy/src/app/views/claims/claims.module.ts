import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClaimsRoutingModule } from './claims-routing.module';
import { DocumentsDeliveryComponent } from './documents-delivery/documents-delivery.component';
import { ListAssignmentsComponent } from './list-assignments/list-assignments.component';
import { ClaimsConsultationComponent } from './claims-consultation/claims-consultation.component';
import { DirectClaimsComponent } from './direct-claims/direct-claims.component';
import { UIModule } from '../../ui.module';





@NgModule({
  declarations: [DocumentsDeliveryComponent, ListAssignmentsComponent, ClaimsConsultationComponent, DirectClaimsComponent],
  imports: [
    CommonModule,
    UIModule,
    ClaimsRoutingModule
  ]
})
export class ClaimsModule { }
