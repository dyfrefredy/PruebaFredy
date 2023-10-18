import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BookingConfirmationComponent } from './booking-confirmation/booking-confirmation.component';
import { BookingReportComponent } from './booking-report/booking-report.component';
import { BookingComponent } from './booking/booking.component';
import { MyTaskDashboardComponent } from './my-task-dashboard/my-task-dashboard.component';
import { QuotationDashboardComponent } from './quotation-dashboard/quotation-dashboard.component';
import { QuotationUserAssignmentComponent } from './our-task/quotation-user-assignment/quotation-user-assignment.component';
import { DashboardComponent } from './our-task/dashboard/dashboard.component';
import { SearchTaskComponent } from './our-task/search-task/search-task.component';
import { ManageYourBookingComponent } from './manage-your-requirement/manage-your-booking/manage-your-booking.component';
import { DashboardYourRequirementComponent } from './manage-your-requirement/dashboard-your-requirement/dashboard-your-requirement.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Customer service'
    },
    children: [
      {
        path: '',
        redirectTo: 'quotation-dashboard'
      },
      {
        path: 'quotation-user-assignment',
        component: QuotationUserAssignmentComponent,
        data: {
          title: 'module.quote.user.moduleName', translate: true
        }
      },
      {
        path: 'our-task-dashboard',
        component: DashboardComponent,
        data: {
          title: 'module.quote.user.moduleName', translate: true
        }
      },
      {
        path: 'booking',
        component: BookingComponent,
        data: {
          title: 'module.booking.moduleName', translate: true
        }
      },
      {
        path: 'booking/:id',
        component: BookingComponent,
        data: {
          title: 'module.booking.moduleName', translate: true
        }
      },
      {
        path: 'booking-report',
        component: BookingReportComponent,
        data: {
          title: 'module.bookingReport.moduleName', translate: true
        }
      },
      {
        path: 'my-task-dashboard',
        component: MyTaskDashboardComponent,
        data: {
          title: 'module.myTaskDashboard.moduleName', translate: true
        }
      },
      {
        path: 'search-task',
        component: SearchTaskComponent,
        data: {
          title: 'module.searchTask.moduleName', translate: true
        }
      },
      {
        path: 'dashboard-your-requirement',
        component: DashboardYourRequirementComponent,
        data: {
          title: 'module.manage-your-Booking.moduleName', translate: true
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerServiceRoutingModule {}
