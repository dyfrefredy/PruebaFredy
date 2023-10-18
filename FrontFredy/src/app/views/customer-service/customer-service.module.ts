import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../ui.module';
import { CustomerServiceRoutingModule } from './customer-service-routing.module';
import {  QuotationDashboardComponent } from './quotation-dashboard/quotation-dashboard.component';
import { QuotationUserAssignmentComponent } from './our-task/quotation-user-assignment/quotation-user-assignment.component';
import { BookingComponent } from './booking/booking.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { DashboardComponent } from './our-task/dashboard/dashboard.component';
import { BookingUserComponent } from './our-task/booking-user/booking-user.component';
import { MyTaskDashboardComponent } from './my-task-dashboard/my-task-dashboard.component';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { SearchTaskComponent } from './our-task/search-task/search-task.component';
import { ManageYourBookingComponent } from './manage-your-requirement/manage-your-booking/manage-your-booking.component';
import { DashboardYourRequirementComponent } from './manage-your-requirement/dashboard-your-requirement/dashboard-your-requirement.component';
import { ManageYourQuotationComponent } from './manage-your-requirement/manage-your-quotation/manage-your-quotation.component';

@NgModule({
  imports: [
    FormsModule,
    UIModule,
    CustomerServiceRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule
  ],
  declarations: [
    QuotationDashboardComponent,
    QuotationUserAssignmentComponent,
    BookingComponent,
    BookingReportComponent,
    DashboardComponent,
    BookingUserComponent,
    BookingReportComponent,
    MyTaskDashboardComponent,
    BookingConfirmationComponent,
    SearchTaskComponent,
    ManageYourBookingComponent,
    DashboardYourRequirementComponent,
    ManageYourQuotationComponent
  ]
})
export class CustomerServiceModule { }
