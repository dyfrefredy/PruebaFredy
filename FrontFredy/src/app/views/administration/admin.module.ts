import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { AirlineComponent } from './airline/airline.component';
import { AdminRoutingModule } from './admin-routing.module';
import { UIModule } from '../../ui.module';
import { CommonModule } from '@angular/common';
import { UserComponent } from './user/user.component';
import { StationComponent } from './station/station.component';
import { HolidayComponent } from './holiday/holiday.component';
import { ConfigurationsTableComponent } from './configurations-table/configurations-table.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LoadItineraryComponent } from './load-itinerary/load-itinerary.component';
import { RoleComponent } from './role/role.component';
import { ModuleComponent } from './module/module.component';
import { RoleModuleComponent } from './role-module/role-module.component';
import { SpecialServicesComponent } from './special-services/special-services.component';
import { SpecialServiceCapacityComponent } from './special-service-capacity/special-service-capacity.component';
import { DryIceSupplyComponent } from './dry-ice-supply/dry-ice-supply.component';
import {PickListModule} from 'primeng/picklist';
import { MessagesComponent } from './messages/messages.component';
import { EscalationComponent } from './escalation/escalation.component';

import { UserCapacityComponent } from './user-capacity/user-capacity.component';
import { ExternalUserApprovalComponent } from './external-user-approval/external-user-approval.component';
import { AutomaticAssignmentsUserComponent } from './automatic-assignments-user/automatic-assignments-user.component';
import { ExternalUserGroupTypeComponent } from './external-user-group-type/external-user-group-type.component';

@NgModule({
  imports: [
    FormsModule,
    AdminRoutingModule,
    UIModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule,
    PickListModule,
  ],
  declarations: [
    AirlineComponent,
    UserComponent,
    StationComponent,
    HolidayComponent,
    ConfigurationsTableComponent,
    UserProfileComponent,
    LoadItineraryComponent,
    RoleComponent,
    ModuleComponent,
    RoleModuleComponent,
    SpecialServicesComponent,
    SpecialServiceCapacityComponent,
    DryIceSupplyComponent,
    MessagesComponent,
    EscalationComponent,
    UserCapacityComponent,
    ExternalUserApprovalComponent,
    AutomaticAssignmentsUserComponent,
    ExternalUserGroupTypeComponent
  ]
})

export class AdminModule { }
