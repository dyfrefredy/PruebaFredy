import { QuotationAsignment } from './../../../model/quotation-asignment';
import { QuoteApproval } from './../../../model/quote-approval';
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
import moment from 'moment';
import { Station } from '../../../model/station';
import { stat } from 'fs';
import { LoadTypeService } from '../../../enumeration/load-type';
import IATACode from '../../../IATACode/IATACode.json';
import  momentTimeZone  from 'moment-timezone';
import { CustomserServiceStatus } from '../../../enumeration/customer-service-status';

@Component({
  selector: 'app-quotation-dashboard',
  templateUrl: './quotation-dashboard.component.html',
  styleUrls: ['./quotation-dashboard.component.scss']
})
export class QuotationDashboardComponent implements OnInit {

  quotationData = [];
  quotationDetailsData = [];
  quotationFind : Quotation;
  quoteDetailsDialog: boolean;
  quoteDetails:Quotation;
  quoteApproval:QuoteApproval;
  originStation: Station;
  destinationStation: Station;

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
  user:User;
  quotationAsignment: QuotationAsignment;
  pharmaDialog: boolean;

  constructor(
    private messageService: MessageService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private translateService: TranslateService,
    private loadTypeService: LoadTypeService,
    public customerServiceStatus: CustomserServiceStatus
  ) {
    this.user = this.authService.currentUserValue;
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 0;

    this.paginationDetails = new Pagination();
    this.paginationDetails.pageSize = 5;
    this.paginationDetails.pageNo = 0;
    this.quotationFind = new Quotation();
    this.quoteApproval = new QuoteApproval();
    this.originStation = new Station();
    this.destinationStation = new Station();
   }

  ngOnInit(): void {
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();

    if(this.originStation.id != undefined){
      this.quotationFind.originStationId = this.originStation.id;
    }else{
      this.quotationFind.originStationId =undefined;
    }

    if(this.destinationStation.id != undefined){
      this.quotationFind.destinationStationId = this.destinationStation.id;
    }else{
      this.quotationFind.destinationStationId =undefined;
    }

    this.quotationFind.quotationAsignment = new QuotationAsignment();
    this.quotationFind.quotationAsignment.userAsignmentId = this.user.id;

    filter = {
      filterDto: this.quotationFind,
      paginationDto: this.pagination
    };
    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.QUOTATION_URL, filter).subscribe(
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
    let filter = new FilterQuery();
    filter = {
      filterDto: {
        QuotationId:this.quoteDetails.id
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
    if(event.sortField!=undefined)
    {
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
    if(event.sortField!=undefined)
    {
      let orderTable = new OrderTable();
      orderTable.sorterField = event.sortField;
      orderTable.sorterMode = event.sortOrder === -1 ? 0 : event.sortOrder;
      this.paginationDetails.orderTable.push(orderTable);
    }

    this.getPaginationAndFilterDetails();
    this.loading = false;
  }

  openQuoteDetails(quotation) {
    this.quotationDetailsData = [];
    this.quoteDetails = quotation;
    this.quotationAsignment = quotation.quotationAsignment;
    this.quoteApproval = quotation.quotationStatus;
    this.quoteApproval.email = quotation.email;
    this.submitted = false;
    this.quoteDetailsDialog = true;
  }

  approval(state) {
    this.submitted = true;
    
    if(state == this.customerServiceStatus.confirmed && (this.quoteApproval.rate <= 0 || !this.quoteApproval.rate)){
      this.loading = false;
      return;
    }
    else if(state == this.customerServiceStatus.cancelled)
    {
      this.quoteApproval.rate = 0;
    }

    this.quoteDetailsDialog = false;
    this.quoteApproval.statusId = state;
    this.quoteApproval.updatedDate = moment().toISOString(true);
    this.saveApproval();
    this.quoteDetails = null;
  }

  saveApproval() {
    this.transactionService.update(environment.adminAPI, this.constantService.QUOTATIONSTATUS_URL, this.quoteApproval).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message,
          });
          this.getPaginationAndFilter();
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

    this.loading = false;
  }

  receiveOriginStation(station: Station){
    this.originStation = station;
  }

  receiveDestinationStation(station: Station){
    this.destinationStation = station;
  }

  onHold() {
    this.loading = true;
    this.quotationAsignment.onHold = true;
    this.quotationAsignment.userUpdateId = this.user.id;
    this.quotationAsignment.comments = this.quoteApproval.comments;
    
    this.transactionService.update(environment.adminAPI, this.constantService.QUOTE_ASIGNMENT_URL, this.quotationAsignment).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('module.quote.moduleName', "moduleName"),
            detail: data.responseDto.message,
          });
          this.quoteDetailsDialog = false;
          this.getPaginationAndFilter();
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

    this.loading = false;
  }

  detailPharma() {
    if (this.quoteDetails.usingPharma?.packagingPassive)
      this.quoteDetails.usingPharma.packagingTypeAnswer = "Passive";
    else if (this.quoteDetails.usingPharma?.containers.length > 0)
      this.quoteDetails.usingPharma.packagingTypeAnswer = "Active";

    if (this.quoteDetails.usingPharma?.containers) {
      this.quoteDetails.usingPharma.containers.forEach(element => {
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
