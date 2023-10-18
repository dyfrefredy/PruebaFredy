import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';
import { DocumentsDeliveryComponent } from './documents-delivery/documents-delivery.component';
import { ListAssignmentsComponent } from './list-assignments/list-assignments.component';
import { ClaimsConsultationComponent } from './claims-consultation/claims-consultation.component';
import { DirectClaimsComponent } from './direct-claims/direct-claims.component';
import { MessagesComponent } from '../administration/messages/messages.component';
import { EscalationComponent } from '../administration/escalation/escalation.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Claims'
    },
    children: [
      {
        path: '',
        redirectTo: 'direct-claims'
      },
      {
        path: 'documents-delivery',
        component: DocumentsDeliveryComponent,
        data: {
          title: 'Entrega de documentos'
        }
      },
      {
        path: 'list-assignments',
        component: ListAssignmentsComponent,
        data: {
          title: 'Listado de reclamos'
        }
      },
      {
        path: 'claims-consultation',
        component: ClaimsConsultationComponent,
        data: {
          title: 'Consulta de reclamos'
        }
      },
      {
        path: 'direct-claims',
        component: DirectClaimsComponent,
        data: {
          title: 'Reclamaciones directas'
        }
      },
      {
        path: 'messages',
        component: MessagesComponent,
        data: {
          title: 'Mensajes'
        }
      },
      {
        path: 'escalation',
        component: EscalationComponent,
        data: {
          title: 'Notificaciones'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClaimsRoutingModule { }
