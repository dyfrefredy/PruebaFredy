import { QuoteApproval } from '../../../model/quote-approval';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { TransactionService } from '../../../services/transaction.service';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user';
import { environment } from '../../../../environments/environment';
import { Quotation } from '../../../model/quotation';
import { City } from '../../../model/city';
import { TranslateService } from "@ngx-translate/core";
import { QuotationAsignment } from '../../../model/quotation-asignment';
import moment from 'moment';
import { BookingModel } from '../../../model/bookingModel';
import { Station } from '../../../model/station';
import { Shipper } from '../../../model/shipper';
import { Consignee } from '../../../model/consignee';
import { BookingHistoryStatus } from '../../../model/booking-history-status';
import { BookingConfirmationLegs } from '../../../model/booking-confirmation-legs';
import { BookingConfirmation } from '../../../model/booking-confirmation';
import { UserCtsDetail } from '../../../model/user-cts-detail';
import { LoadTypeService } from '../../../enumeration/load-type';

@Component({
  selector: 'app-booking-confirmation',
  templateUrl: './booking-confirmation.component.html',
  styleUrls: ['./booking-confirmation.component.css']
})

export class BookingConfirmationComponent implements OnInit {
  bookingModelFind: BookingModel;
  originStationFind: Station;
  destinationStationFind: Station;
  bookingModels: BookingModel[];
  bookingModel: BookingModel;
  quotation: Quotation;
  originStation: Station;
  destinationStation: Station;
  shipperInfo: Shipper;
  consigneeInfo: Consignee;
  bookingHistoryStatus: BookingHistoryStatus;
  bookingConfirmationLeg: BookingConfirmationLegs;
  originStationLeg: Station;
  destinationStationLeg: Station;
  bookingConfirmation: BookingConfirmation;
  estimatedTimeDeparture: Date;
  estimatedTimeArrival: Date;

  bookingDetailsDialog: boolean;
  bookingForm: FormGroup;

  confirmDialog: boolean;
  confirmForm: FormGroup;
  confirmLegForm: FormGroup;

  loading: boolean;
  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;
  submitted: boolean;
  submittedLeg: boolean;
  submittedConfirm: boolean;
  user: User;
  pharmaDialog: boolean;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private translateService: TranslateService,
    private loadTypeService: LoadTypeService
  ) {
    this.bookingForm = this.fb.group({
      userName: ['', Validators.required],
      customer: [''],
      docNum: ['', Validators.required],
      quotationId: ['',],
      originStation: ['', Validators.required],
      destinationStation: ['', Validators.required],
      estimatedDeliveryDate: [''],
      loadTypeId: ['', Validators.required],
      piece: ['', Validators.required],
      weightKgs: [''],
      volume: [''],
      measurementUnit: [''],
      chargeableWeight: ['', Validators.required],
      rate: ['', Validators.required],
      shc: [''],
      description: ['', Validators.required],
      bookingInstruction: [''],
      flightNumber: [''],
      estimatedFlightDate: ['', Validators.required],
      company: [''],
      lengthUnitId: ['', Validators.required],
      weightUnitId: ['', Validators.required],
      removable: ['', Validators.required],
      comment: [''],
      paymentMode: ['', Validators.required],
      shipperInformation: ['', Validators.required],
      consigneeInformation: ['', Validators.required]
    });

    this.confirmLegForm = this.fb.group({
      flight: ['', Validators.required],
      date: ['', Validators.required],
      originStationLeg: ['', Validators.required],
      destinationStationLeg: ['', Validators.required],
      aircraftType: ['', Validators.required]
    })

    this.confirmForm = this.fb.group({
      estimatedTimeDeparture: ['', Validators.required],
      estimatedTimeArrival: [''],
      rate: ['', Validators.required],
      cutOffTime: [''],
      comments: [''],
      emails: ['']
    })

    this.user = this.authService.currentUserValue;
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 0;
    this.bookingModelFind = new BookingModel();
    this.bookingModelFind.bookingHistoryStatus = [];
  }

  ngOnInit(): void {
  }

  get f() {
    return this.confirmLegForm.controls;
  }

  get f2() {
    return this.confirmForm.controls;
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();
    let bookingHistoryStatus = new BookingHistoryStatus();
    bookingHistoryStatus.userAssigmentId = this.user.id;    
    this.bookingModelFind.bookingHistoryStatus.push(bookingHistoryStatus);

    filter = {
      filterDto: this.bookingModelFind,
      paginationDto: this.pagination
    };
    this.transactionService
    .getPaginationAndFilter(environment.adminAPI, `${this.constantService.BOOKING_URL}/GetBookingAsignment`, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.bookingModels = data.businessDto;
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

  loadBookings(event: LazyLoadEvent) {
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

  openDetails(bookingModel) {
    this.bookingModel = bookingModel;
    //this.bookingModel.bookingDetails = [];
    this.bookingModel.bookingDetails = bookingModel.bookingDetails;
    this.quotation = this.bookingModel.quotation;
    this.originStation = this.bookingModel.orgStation;
    this.destinationStation = this.bookingModel.destStation;
    this.shipperInfo = this.bookingModel.shipperInformation;
    this.consigneeInfo = this.bookingModel.consigneeInformation;
    this.bookingDetailsDialog = true;
  }

  onHold() {
    this.loading = true;
    this.bookingHistoryStatus = new BookingHistoryStatus();
    this.bookingHistoryStatus.bookingId = this.bookingModel.id;
    this.bookingHistoryStatus.bookingStatusId = this.constantService.BookingStatusIdOnHold;
    this.bookingHistoryStatus.userAssigmentId = this.user.id;
    this.bookingHistoryStatus.active = true;
    this.bookingHistoryStatus.createdUserId = this.user.id;
    this.bookingHistoryStatus.createdDate = new Date(Date.now());

    this.transactionService.save(environment.adminAPI, this.constantService.BOOKING_HISTORY_STATUS, this.bookingHistoryStatus).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.getPaginationAndFilter();
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message,
          });
          this.hideDialog();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
            detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
          life: 8000,
        });
      }
    );

    this.loading = false;
  }

  cancel() {
    this.loading = true;
    this.bookingHistoryStatus = new BookingHistoryStatus();
    this.bookingHistoryStatus.bookingId = this.bookingModel.id;
    this.bookingHistoryStatus.bookingStatusId = this.constantService.BookingStatusIdCancelled;
    this.bookingHistoryStatus.userAssigmentId = this.bookingModel.bookingHistoryLastStatus.userAssigmentId;
    this.bookingHistoryStatus.active = true;
    this.bookingHistoryStatus.createdUserId = this.user.id;
    this.bookingHistoryStatus.createdDate = new Date(Date.now());

    this.transactionService.save(environment.adminAPI, this.constantService.BOOKING_HISTORY_STATUS, this.bookingHistoryStatus).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.getPaginationAndFilter();
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message,
          });
          this.hideDialog();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
            detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
          life: 8000,
        });
      }
    );

    this.loading = false;
  }

  confirm() {
    this.bookingConfirmation = new BookingConfirmation();
    this.bookingConfirmation.bookingConfirmationLegs = [];
    this.bookingConfirmation.bookingId = this.bookingModel.id;
    this.bookingConfirmation.rate = this.bookingModel.rate;
    this.bookingConfirmation.createdUserId = this.user.id;

    this.bookingConfirmationLeg = new BookingConfirmationLegs();
    this.originStationLeg = null;
    this.destinationStationLeg = null;

    this.submittedLeg = false;
    this.submittedConfirm = false;
    this.confirmDialog = true;
  }

  addLeg() {
    this.submittedLeg = true;
    this.loading = true;

    if (this.confirmLegForm.invalid) {
      this.loading = false;
      return;
    }

    this.bookingConfirmationLeg.originStationId = this.originStationLeg.id;
    this.bookingConfirmationLeg.originStationName = this.originStationLeg.name;
    this.bookingConfirmationLeg.destinationStationId = this.destinationStationLeg.id;
    this.bookingConfirmationLeg.destinationStationName = this.destinationStationLeg.name;

    this.bookingConfirmation.bookingConfirmationLegs.push(this.bookingConfirmationLeg);

    this.bookingConfirmationLeg = new BookingConfirmationLegs();
    this.originStationLeg = null;
    this.destinationStationLeg = null;
    this.submittedLeg = false;
    this.loading = false;
  }

  saveConfirm() {
    this.submittedConfirm = true;
    this.loading = true;

    if (this.confirmForm.invalid || this.bookingConfirmation.bookingConfirmationLegs.length <= 0) {
      this.loading = false;
      return;
    }

    this.bookingConfirmation.etd = this.estimatedTimeDeparture.getHours() + ':' + this.estimatedTimeDeparture.getMinutes();

    if (this.estimatedTimeArrival != null)
      this.bookingConfirmation.eta = this.estimatedTimeArrival.getHours() + ':' + this.estimatedTimeArrival.getMinutes();

    this.transactionService.save(environment.adminAPI, this.constantService.BOOKING_CONFIRMATION_URL, this.bookingConfirmation)
    .subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.getPaginationAndFilter();
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message,
          });
          this.hideDialog();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
            detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.myTaskDashboard.bookingConfirmation.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
          life: 8000,
        });
      }
    );

    this.loading = false;
  }

  hideDialog() {
    this.bookingDetailsDialog = false;
    this.confirmDialog = false;
  }

  hideConfirmDialog() {
    this.confirmDialog = false;
  }

  detailPharma() {
    if (this.bookingModel.usingPharma?.packagingPassive)
      this.bookingModel.usingPharma.packagingTypeAnswer = "Passive";
    else if (this.bookingModel.usingPharma?.containers.length > 0)
      this.bookingModel.usingPharma.packagingTypeAnswer = "Active";

    if (this.bookingModel.usingPharma?.containers) {
      this.bookingModel.usingPharma.containers.forEach(element => {
        if (element.dryIceResupply)
          element.dryIceResupplyAnswer = "Yes"
        else
          element.dryIceResupplyAnswer = "No"

        if (element.positioning)
          element.positioningAnswer = "Yes"
        else
          element.positioningAnswer = "No"

        if (element.repositioningStation)
          element.repositioningAnswer = "Yes"
        else
          element.repositioningAnswer = "No"
      });
    }

    this.pharmaDialog = true;
  }
}
