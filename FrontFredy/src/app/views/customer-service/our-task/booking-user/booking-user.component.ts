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
import { City } from '../../../../model/city';
import { TranslateService } from "@ngx-translate/core";
import { QuotationAsignment } from '../../../../model/quotation-asignment';
import { BookingModel } from '../../../../model/bookingModel';
import { BookingHistoryStatus } from '../../../../model/booking-history-status';
import { RoleService } from '../../../../enumeration/role-service';
import { UserCtsDetail } from '../../../../model/user-cts-detail';
import { Station } from '../../../../model/station';

@Component({
  selector: 'booking-user',
  templateUrl: './booking-user.component.html',
  styleUrls: ['./booking-user.component.css']
})
export class BookingUserComponent implements OnInit {

  @Input() comeRole: Boolean = false;
  bookingData = [];
  quotationDetailsData = [];
  bookingFind: BookingModel;
  userAsignmentFind: User;
  bookingHistoryStatusFind: BookingHistoryStatus;
  bookingDialog: boolean;
  bookingDetails: BookingModel;
  bookinghistory: BookingHistoryStatus;
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
    this.bookingFind = new BookingModel();
    this.bookingFind.user = new User();
    this.bookingFind.user.userCtsDetail = new UserCtsDetail();
    this.quoteApproval = new QuoteApproval();
    this.originStation = new Station();
    this.destinationStation = new Station();
    this.userAsignmentFind = new User();
    this.bookingHistoryStatusFind = new BookingHistoryStatus();
    this.bookingHistoryStatusFind.user = new User();

    this.status = new Array();
    this.status = [
      { label: '', value: 0 },
      { label: this.translateService.instant('module.quote.user.statuses.pending', "pending"), value: 1 },
      { label: this.translateService.instant('module.quote.user.statuses.assigned', "assigned"), value: 2 },
    ];
  }

  ngOnInit(): void {
    this.bookinghistory = new BookingHistoryStatus();
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();

    if (this.bookingFind.createdDate == null)
      this.bookingFind.createdDate = undefined;

    if (this.originStation.id != undefined) {
      this.bookingFind.orgStationId = Number(this.originStation.id);
    } else {
      this.bookingFind.orgStationId = undefined;
    }

    if (this.destinationStation.id != undefined) {
      this.bookingFind.destStationId = Number(this.destinationStation.id);
    } else {
      this.bookingFind.destStationId = undefined;
    }

    if (this.bookingFind.estimatedFlightDate == null)
      this.bookingFind.estimatedFlightDate = undefined;

    if (this.userAsignmentFind.id != undefined) {
      this.bookingFind.userId = this.userAsignmentFind.id;
    } else {
      this.bookingFind.userId = undefined;
    }

    if (this.bookingHistoryStatusFind.createdDate != null || this.bookingHistoryStatusFind.user.id != null
      || this.bookingHistoryStatusFind.bookingStatusId != null
    ) {
      this.bookingFind.bookingHistoryStatus = [];

      if (this.bookingHistoryStatusFind.createdDate == null)
        this.bookingHistoryStatusFind.createdDate = undefined;

      this.bookingFind.bookingHistoryStatus.push(this.bookingHistoryStatusFind);
    } else {
      this.bookingFind.bookingHistoryStatus = undefined;
    }

    filter = {
      filterDto: this.bookingFind,
      paginationDto: this.pagination
    };
    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.BOOKING_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          console.log(data.businessDto);
          this.bookingData = data.businessDto;
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

  loadBooking(event: LazyLoadEvent) {
    this.loading = true;
    this.pagination.pageSize = event.rows;
    this.pagination.pageNo = event.first / event.rows;
    this.pagination.orderTable = [];


    // let orderTable = new OrderTable();
    // orderTable.sorterField = "creationDate";
    // orderTable.sorterMode = 0;
    // this.pagination.orderTable.push(orderTable);

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

  openAssignUser(booking) {
    this.bookingDialog = true;
    this.bookingDetails = booking;

    // Validación de rol de acuerdo a Bug308280
    if (this.user.roleId != this.roleService.customerServiceAdm)
      this.userAsignment = this.user;
  }

  openReAssignUser(booking) {
    this.bookingDetails = booking;

    this.userAsignment = booking.bookingHistoryLastStatus.user;
    /*this.userAsignment.id = this.bookingDetails.userId;
    this.userAsignment.firstName = this.bookingDetails.user.firstName;
    this.userAsignment.lastName = this.bookingDetails.user.lastName;*/

    this.userChange = true;
    this.bookingDialog = true;
  }

  hideDialog() {
    this.userAsignment = null;
    this.submitted = false;
    this.loading = false;
    this.bookingDialog = false;
  }

  saveAsignment() {
    this.submitted = true;
    this.loading = true;

    if (this.userAsignmentForm.invalid) {
      this.loading = false;
      return;
    }

    if (this.bookingDetails.user) {
      if (this.userAsignment.id == this.bookingDetails.bookingHistoryLastStatus?.user?.id) {
        this.userChange = false;
        this.loading = false;
        return;
      }

      this.bookinghistory.bookingId = this.bookingDetails.id;
      this.bookinghistory.bookingStatusId = 2;
      this.bookinghistory.userAssigmentId = this.userAsignment.id;
      this.bookinghistory.createdUserId = this.user.id;
      // this.bookingDetails.user.id = this.userAsignment.id;
      // this.bookingDetails.user.updatedDate = moment().toISOString(true);

      this.transactionService.save(environment.adminAPI, this.constantService.BOOKING_HISTORY_STATUS, this.bookinghistory).subscribe(
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

  receiveOriginStation(user: Station){
    this.originStation = user;
  }

  receiveDestinationStation(user: Station){
    this.destinationStation = user;
  }

  receiveUser(user: User){
    this.bookingHistoryStatusFind.user = user;
  }
}
