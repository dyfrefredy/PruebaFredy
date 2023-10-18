import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AirlineComponent } from './airline/airline.component';
import { UserComponent } from './user/user.component';
import { StationComponent } from './station/station.component';
import { HolidayComponent } from './holiday/holiday.component';
import { ConfigurationsTableComponent } from './configurations-table/configurations-table.component';
import { LoadItineraryComponent } from './load-itinerary/load-itinerary.component';
import { RoleComponent } from './role/role.component';
import { ModuleComponent } from './module/module.component';
import { RoleModuleComponent } from './role-module/role-module.component';
import { SpecialServicesComponent } from './special-services/special-services.component';
import { SpecialServiceCapacityComponent } from './special-service-capacity/special-service-capacity.component';
import { DryIceSupplyComponent } from './dry-ice-supply/dry-ice-supply.component';
import { MessagesComponent } from './messages/messages.component';
import { EscalationComponent } from './escalation/escalation.component';
import { UserCapacityComponent } from './user-capacity/user-capacity.component';
import { ExternalUserApprovalComponent } from './external-user-approval/external-user-approval.component';
import { AutomaticAssignmentsUserComponent } from './automatic-assignments-user/automatic-assignments-user.component';
import { ExternalUserGroupTypeComponent } from './external-user-group-type/external-user-group-type.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'module.admin.moduleName', translate: true
    },
    children: [
      {
        path: '',
        redirectTo: 'user'
      },
      {
        path: 'airline',
        component: AirlineComponent,
        data: {
          title: 'Aerolinea'
        }
      },
      {
        path: 'user',
        component: UserComponent,
        data: {
          title: 'Usuario'
        }
      },
      {
        path: 'loadItinerary',
        component: LoadItineraryComponent,
        data: {
          title: 'module.importItinerary.moduleName', translate: true
        }
      },
      {
        path: 'role',
        component: RoleComponent,
        data: {
          title: 'Roles'
        }
      },
      {
        path: 'module',
        component: ModuleComponent,
        data: {
          title: 'Módulo'
        }
      },
      {
        path: 'roleModule',
        component: RoleModuleComponent,
        data: {
          title: 'Roles y Modulos'
        }
      },
      {
        path: 'special-services',
        component: SpecialServicesComponent,
        data: {
          title: 'special services'
        }
      },
      {
        path: 'special-services-capacity',
        component: SpecialServiceCapacityComponent,
        data: {
          title: 'special services capacity'
        }
      },
      {
        path: 'dry-Ice-supply',
        component: DryIceSupplyComponent,
        data: {
          title: 'Dry Ice Supply'
        }
      },
      {
        path: 'messages',
        component: MessagesComponent,
        data: {
          title: 'Messages'
        }
      },
      {
        path: 'escalation',
        component: EscalationComponent,
        data: {
          title: 'Escalation'
        }
      },
      {
        path: 'user-capacity',
        component: UserCapacityComponent,
        data: {
          title: 'User Capacity'
        }
      },
      {
        path: 'external-user-approval',
        component: ExternalUserApprovalComponent,
        data: {
          title: 'External user approval'
        }
      },
      {
        path: 'automatic-assignments-user',
        component: AutomaticAssignmentsUserComponent,
        data: {
          title: 'Automatic assignments user'
        }
      },
      {
        path: 'external-user-group-type',
        component: ExternalUserGroupTypeComponent,
        data: {
          title: 'module.externalUserGroupType.moduleName', translate: true
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule {}
