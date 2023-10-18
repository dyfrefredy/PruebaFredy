import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { UIModule } from '../../ui.module';
import { CommonModule } from '@angular/common';
import { ProcessRoutingModule } from './process.routing.module';
import { GuideMasterComponent } from './guide-master/guide-master.component';
import { GuideMaterDetailComponent } from './guide-master-detail/guide-master-detail.component';
import { GuideMasterSenderComponent } from './guide-master-sender/guide-master-sender.component';
import { GuideMasterConveyorComponent } from './guide-master-conveyor/guide-master-conveyor.component';
import { GuideMasterConsigneeComponent } from './guide-master-consignee/guide-master-consignee.component';
import { GuideMasterDestinationComponent } from './guide-master-destination/guide-master-destination.component';
import { GuideMasterCargoComponent } from './guide-master-cargo/guide-master-cargo.component';


@NgModule({
  imports: [
    FormsModule,
    ProcessRoutingModule,
    UIModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule
  ],
  declarations: [ GuideMasterComponent, GuideMaterDetailComponent, GuideMasterSenderComponent, GuideMasterConveyorComponent, GuideMasterConsigneeComponent, GuideMasterDestinationComponent, GuideMasterCargoComponent]
})
export class ProcessModule { }
