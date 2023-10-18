import { QuoteApproval } from '../../../../model/quote-approval';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ConstantService } from '../../../../constant/constant-service';
import { TransactionService } from '../../../../services/transaction.service';
import { FilterQuery } from '../../../../model/filter-query';
import { Pagination } from '../../../../model/pagination';
import { OrderTable } from '../../../../model/order-table';
import { AuthService } from '../../../../services/auth.service';
import { User } from '../../../../model/user';
import { environment } from '../../../../../environments/environment';
import { Quotation } from '../../../../model/quotation';
import { City } from '../../../../model/city';
import { TranslateService } from "@ngx-translate/core";
import { QuotationAsignment } from '../../../../model/quotation-asignment';
import moment from 'moment';
import { RoleService } from '../../../../enumeration/role-service';
import { Station } from '../../../../model/station';

@Component({
  selector: 'app-quotation-user-assignment',
  templateUrl: './quotation-user-assignment.component.html',
  styleUrls: ['./quotation-user-assignment.component.scss']
})

export class QuotationUserAssignmentComponent implements OnInit {
  @Input() comeRole: Boolean = false;
  quotationData = [];
  quotationDetailsData = [];
  quotationFind: Quotation;
  userAsignmentFind: User;
  quoteDetailsDialog: boolean;
  quoteDetails: Quotation;
  quoteApproval: QuoteApproval;
  originStation: Station;
  destinationStation: Station;
  userAsignment: any;
  quotationAsignment: QuotationAsignment;
  userChange: boolean;
  status: Array<{ label: string; value: number }>;

  userAsignmentForm: FormGroup;
  loading: boolean;
  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;
  submitted: boolean;

  paginationDetails: Pagination;
  totalRecordsDatails: Number;
  firstDetails: Number = 1;
  rowsDetails: Number = 5;
  lastDetails: Number = 1;
  user: User;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private translateService: TranslateService,
    private roleService: RoleService
  ) {
    this.userAsignmentForm = this.fb.group({
      userAsignment: ['', Validators.required],
    });
    

    this.user = this.authService.currentUserValue;
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 0;

    this.paginationDetails = new Pagination();
    this.paginationDetails.pageSize = 5;
    this.paginationDetails.pageNo = 0;
    this.quotationFind = new Quotation();
    this.quotationFind.quotationAsignment = new QuotationAsignment();
    this.quoteApproval = new QuoteApproval();
    this.originStation = new Station();
    this.destinationStation = new Station();
    this.userAsignmentFind = new User();

    this.status = new Array();
    this.status = [
      { label: '', value: 0 },
      { label: this.translateService.instant('module.quote.user.statuses.pending', "pending"), value: 1 },
      { label: this.translateService.instant('module.quote.user.statuses.assigned', "assigned"), value: 2 },
    ];
  }

  ngOnInit(): void {
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();

    if (this.originStation.id != undefined) {
      this.quotationFind.originStationId = this.originStation.id;
    } else {
      this.quotationFind.originStationId = undefined;
    }

    if (this.destinationStation.id != undefined) {
      this.quotationFind.destinationStationId = this.destinationStation.id;
    } else {
      this.quotationFind.destinationStationId = undefined;
    }

    if (this.userAsignmentFind.id != undefined) {
      this.quotationFind.quotationAsignment.userAsignmentId = this.userAsignmentFind.id;
    } else {
      this.quotationFind.quotationAsignment.userAsignmentId = undefined;
    }

    if (this.quotationFind.creationDate == null)
      this.quotationFind.creationDate = undefined;

    filter = {
      filterDto: this.quotationFind,
      paginationDto: this.pagination
    };
    this.transactionService.GetPaginationAndFilterAsignment(environment.adminAPI, this.constantService.QUOTATION_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.quotationData = data.businessDto;
          this.totalRecords = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message,
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
        });
      }
    );

  }

  getPaginationAndFilterDetails() {
    this.quotationDetailsData = [];
    let filter = new FilterQuery();
    filter = {
      filterDto: {
        QuotationId: this.quoteDetails.id
      },
      paginationDto: this.paginationDetails
    };
    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.QUOTEDETAILS_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.quotationDetailsData = data.businessDto;
          this.totalRecordsDatails = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message,
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
        });
      }
    );

  }

  loadQuotation(event: LazyLoadEvent) {
    this.loading = true;
    this.pagination.pageSize = event.rows;
    this.pagination.pageNo = event.first / event.rows;
    this.pagination.orderTable = [];

    //Para conocer los campos por los cuales se va a filtrar
    if (event.sortField != undefined) {
      let orderTable = new OrderTable();
      orderTable.sorterField = event.sortField;
      orderTable.sorterMode = event.sortOrder === -1 ? 0 : event.sortOrder;
      this.pagination.orderTable.push(orderTable);
    }

    this.getPaginationAndFilter();
    this.loading = false;
  }

  loadQuotationDetails(event: LazyLoadEvent) {
    this.loading = true;
    this.paginationDetails.pageSize = event.rows;
    this.paginationDetails.pageNo = event.first / event.rows;
    this.paginationDetails.orderTable = [];

    //Para conocer los campos por los cuales se va a filtrar
    if (event.sortField != undefined) {
      let orderTable = new OrderTable();
      orderTable.sorterField = event.sortField;
      orderTable.sorterMode = event.sortOrder === -1 ? 0 : event.sortOrder;
      this.paginationDetails.orderTable.push(orderTable);
    }

    this.getPaginationAndFilterDetails();
    this.loading = false;
  }

  openAssignUser(quotation) {
    this.quoteDetails = quotation;
    this.quoteDetailsDialog = true;
    this.quoteApproval.email = quotation.email;
    this.userAsignment = new User();
    // Validación de rol de acuerdo a Bug308280
    if (this.user.roleId != this.roleService.customerServiceAdm)
      this.userAsignment = this.user;
  }

  openReAssignUser(quotation) {
    this.quoteDetails = quotation;

    this.userAsignment = new User();
    this.userAsignment.id = this.quoteDetails.quotationAsignment.userAsignmentId;
    this.userAsignment.firstName = this.quoteDetails.quotationAsignment.userAsignmentFirstName;
    this.userAsignment.lastName = this.quoteDetails.quotationAsignment.userAsignmentLastName;

    this.userChange = true;

    this.quoteDetailsDialog = true;
  }

  hideDialog() {
    this.userAsignment = null;
    this.submitted = false;
    this.loading = false;
    this.quoteDetailsDialog = false;
  }

  saveAsignment() {
    this.submitted = true;
    this.loading = true;

    if (this.userAsignmentForm.invalid) {
      this.loading = false;
      return;
    }

    if (this.quoteDetails.quotationAsignment) {
      if (this.userAsignment.id == this.quoteDetails.quotationAsignment.userAsignmentId) {
        this.userChange = false;
        this.loading = false;
        return;
      }

      this.quoteDetails.quotationAsignment.userAsignmentId = this.userAsignment.id;
      this.quoteDetails.quotationAsignment.updatedDate = moment().toISOString(true);

      this.transactionService.update(environment.adminAPI, this.constantService.QUOTE_ASIGNMENT_URL, this.quoteDetails.quotationAsignment).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.getPaginationAndFilter();
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
              detail: data.responseDto.message,
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
              detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
            life: 8000,
          });
        }
      );
    } else {
      this.quotationAsignment = new QuotationAsignment();

      this.quotationAsignment.userAsignmentId = this.userAsignment.id;
      this.quotationAsignment.userCreatedId = this.user.id;
      this.quotationAsignment.createdDate = moment().toISOString(true);
      this.quotationAsignment.updatedDate = moment().toISOString(true);
      this.quotationAsignment.quotationId = this.quoteDetails.id;

      this.transactionService.save(environment.adminAPI, this.constantService.QUOTE_ASIGNMENT_URL, this.quotationAsignment).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.getPaginationAndFilter();
            this.messageService.add({
              severity: 'success',
              summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
              detail: data.responseDto.message,
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
              detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
            life: 8000,
          });
        }
      );
    }

    this.loading = false;
    this.hideDialog();
  }

  receiveUser(user: User){
    this.userAsignmentFind = user;
  }

  receiveOriginStation(station: Station){
    this.originStation = station;
  }

  receiveDestinationStation(station: Station){
    this.destinationStation = station;
  }
}
