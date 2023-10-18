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

@Component({
  selector: 'app-guide-dashboard',
  templateUrl: './guide-dashboard.component.html',
  styleUrls: ['./guide-dashboard.component.scss']
})
export class GuideDashboardComponent implements OnInit {
  pagination: Pagination;
  paginationGideActive: Pagination;
  airWaybillSearch:AirWaybillSearch;
  airWaybillSearchForm:FormGroup;

  submitted: boolean;
  loading: boolean;

  totalRecords: number;
  first: number = 1;
  rows: number = 10;
  last: number = 1;

  tabViewIndex:Number;
  filters:{
    guideAcceptances:GuideAcceptance[],
    guideActives:GuideActive[],
    airWaybillSearch:AirWaybillSearch,
    guideAlert: GuideAlert[],
    specialServiceRouteStatuses: SpecialServiceRouteStatus[],
  }
  totalRecordsAcceptance: number;
  totalRecordsActive: number;

  constructor(private fb: FormBuilder,
    private authService:AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService) {
      this.airWaybillSearchForm = this.fb.group({
        station: ['', Validators.required],
        awb: [""],
      });
      this.tabViewIndex = 1;
  }

  ngOnInit(): void {
    this.airWaybillSearch = new AirWaybillSearch();
    this.filters ={
      guideAcceptances :[],
      guideActives :[],
      airWaybillSearch:new AirWaybillSearch(),
      specialServiceRouteStatuses: [],
      guideAlert:[]
    }
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;

    this.paginationGideActive = new Pagination();
    this.paginationGideActive.pageSize = 10;
    this.paginationGideActive.pageNo = 1;

    this.totalRecordsAcceptance = 0;
    this.totalRecordsActive = 0;
  }


  getGuides(){
    this.submitted = true;
    this.loading = true;

    // stop here if airlineform is invalid
    if (this.airWaybillSearchForm.invalid) {
      this.loading = false;
      return;
    }
    this.getGuidesAcceptance();
    this.getGuidesActive();
    this.getGuidesNotify();
    this.getSpecialService();
  }

  getSpecialService(){
    this.loading = true;
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
    this.pagination.orderTable = [];

    this.getSpecialServicePaginationAndFilter();
    this.loading = false;
  }

  getSpecialServicePaginationAndFilter(){
    let filter = new FilterQuery();
    let specialServicefilter = {
      stationId: this.airWaybillSearch.station,
      specialServiceRoute: {
        specialService: {
          awb: this.airWaybillSearch.awb
        }
      }
    }

    filter = {
      filterDto: specialServicefilter,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.pharmaAPI, this.constantService.SPECIAL_SERVICE_ROUTE_STATE_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.filters.specialServiceRouteStatuses = data.businessDto;
          this.filters.airWaybillSearch = this.airWaybillSearch;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Fecha',
            detail: data.responseDto.message,
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Por favor, intente nuevamente.',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  getGuidesActive(){
    this.loading = true;
    this.paginationGideActive.pageSize = 50;
    this.paginationGideActive.pageNo = 0;
    this.paginationGideActive.orderTable = [];

    this.getGuidActivePaginationAndFilter();
    this.loading = false;
  }

  getGuidActivePaginationAndFilter(){
    let filter = new FilterQuery();
    let guideActive = new GuideActive();
	  guideActive.waybillStatus = new WaybillStatus();
	  guideActive.waybillStatus.stationId = this.airWaybillSearch.station;
    guideActive.docNum = this.airWaybillSearch.awb;

    filter = {
      filterDto: guideActive,
      paginationDto: this.paginationGideActive
    };

    this.transactionService.getPaginationAndFilterActives(environment.pharmaAPI, this.constantService.WAYBILL_RPA_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.filters.guideActives=data.businessDto;
          this.filters.airWaybillSearch = this.airWaybillSearch;
          this.totalRecordsActive = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Fecha',
            detail: data.responseDto.message,
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Por favor, intente nuevamente.',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  getGuidesAcceptance(){
    this.loading = true;
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
    this.pagination.orderTable = [];


    this.getGuidAcceptancePaginationAndFilter();
    this.loading = false;
  }

  getGuidAcceptancePaginationAndFilter(){
    let filter = new FilterQuery();
    let guideAcceptance = new GuideAcceptance();
    guideAcceptance.brdPtStationId = this.airWaybillSearch.station;
    guideAcceptance.docNum = this.airWaybillSearch.awb;
    filter = {
      filterDto: guideAcceptance,
      paginationDto: this.pagination,
    };
     this.transactionService
       .getPaginationAndFilter(environment.pharmaAPI, this.constantService.WAYBILL_RPA_URL, filter)
       .subscribe(
         (data) => {
           if (data.responseDto.response === this.constantService.RESPONSE_OK) {
             this.filters.guideAcceptances = data.businessDto;
             this.filters.airWaybillSearch = this.airWaybillSearch;
             this.totalRecordsAcceptance = data.totalRecords;
           } else {
             this.messageService.add({
               severity: 'warn',
               summary: 'Fecha',
               detail: data.responseDto.message,
               life: 8000,
             });
           }
         },
         (error) => {
           this.messageService.add({
             severity: 'error',
             summary: 'Por favor, intente nuevamente.',
             detail: 'Por favor, intente más tarde.',
           });
         }
       );
  }
  getGuidesNotify(){
    this.loading = true;
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
    this.pagination.orderTable = [];


    this.getGuidNotifyPaginationAndFilter();
    this.loading = false;
  }

  getGuidNotifyPaginationAndFilter(){
    let filter = new FilterQuery();
    var authUser=this.authService.getAccount();
    let guideAlert = {
      brdPtStationId : this.airWaybillSearch.station,
      email: authUser.idToken.emails[0]
    };
    filter = {
      filterDto: guideAlert,
      paginationDto: this.pagination,
    };
     this.transactionService
       .getPaginationAndFilter(environment.pharmaAPI, `${this.constantService.WAYBILL_RPA_URL}/GetPharmaNotify`, filter)
       .subscribe(
         (data) => {
           if (data.responseDto.response === this.constantService.RESPONSE_OK) {
             this.filters.guideAlert = data.businessDto;
             this.filters.airWaybillSearch = this.airWaybillSearch;
           } else {
             this.messageService.add({
               severity: 'warn',
               summary: 'Fecha',
               detail: data.responseDto.message,
               life: 8000,
             });
           }
         },
         (error) => {
           this.messageService.add({
             severity: 'error',
             summary: 'Por favor, intente nuevamente.',
             detail: 'Por favor, intente más tarde.',
           });
         }
       );
  }
}
