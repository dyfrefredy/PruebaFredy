import { AuthService } from './../../../services/auth.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { AirWaybillSearch } from '../../../model/air-waybill-search';
import { FilterQuery } from '../../../model/filter-query';
import { GuideAcceptance } from '../../../model/guide-acceptance';
import { GuideActive } from '../../../model/guide-active';
import { GuideAlert } from '../../../model/guide-alert';
import { Pagination } from '../../../model/pagination';
import { WaybillStatus } from '../../../model/waybill-status';
import { TransactionService } from '../../../services/transaction.service';
import { SpecialServiceRoute } from '../../../model/special-service-route';
import { SpecialServiceRouteStatus } from '../../../model/special-service-route-status';
import { User } from '../../../model/user';

@Component({
  selector: 'app-guide-dashboard',
  templateUrl: './my-task-dashboard.component.html',
  styleUrls: ['./my-task-dashboard.component.css']
})
export class MyTaskDashboardComponent implements OnInit {
  user: User;
  tabViewIndex: Number;
  automaticAssigmentTransation: boolean = true;

  constructor(private fb: FormBuilder,
    private authService: AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService) {
    this.user = this.authService.currentUserValue;
    this.AutomaticAssignmentOfTasks();
    this.tabViewIndex = 0;

  }

  ngOnInit(): void {
  }

  AutomaticAssignmentOfTasks() {
    this.transactionService.GetList(environment.adminAPI, this.constantService.AUTOMATIC_ASSIGNMENT_OF_TASKS, "/" + this.user.id)
    .subscribe(
      (data) => {
        this.automaticAssigmentTransation=false;
      }

    );
  }


  
}
