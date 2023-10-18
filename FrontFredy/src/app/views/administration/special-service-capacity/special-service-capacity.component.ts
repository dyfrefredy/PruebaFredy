import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecialServiceContainer } from '../../../model/special-service-container';
import { SpecialServiceRoute } from '../../../model/special-service-route';
import { SpecialService } from '../../../model/special-service';
import { TransactionService } from '../../../services/transaction.service';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { SpecialServiceType } from '../../../model/special-service-type';
import { Station } from '../../../model/station';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';

@Component({
  selector: 'app-special-service-capacity',
  templateUrl: './special-service-capacity.component.html',
  styleUrls: ['./special-service-capacity.component.scss']
})

export class SpecialServiceCapacityComponent implements OnInit {
  user: User;
  specialServiceCapacityForm:FormGroup;
  specialService:SpecialService;
  specialServices:SpecialService[];
  specialServicesFind:SpecialService;
  specialServiceContainers:SpecialServiceContainer[];
  specialServiceRoutes:SpecialServiceRoute[];
  specialServiceRoute:SpecialServiceRoute;
  specialServiceType:SpecialServiceType;
  specialServiceTypeFind:SpecialServiceType;
  stationOriginFind:Station;
  stationDestinyFind:Station;
  specialServicesRouteFind:SpecialServiceRoute;
  stationOriginRouteFind:Station;
  stationDestinyRouteFind:Station;
  specialServicesRouteAdd:SpecialServiceRoute;
  stationOriginRouteAdd:Station;
  stationDestinyRouteAdd:Station;
  stationOrigin:Station;
  stationDestiny:Station;
  serviceDialog:boolean;
  submitted: boolean;
  loading: boolean;

  pagination: Pagination;
  totalRecords: Number;

  containerPagination: Pagination;
  containerTotalRecords: Number;

  submittedF1: boolean;
  loadingF1: boolean;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private authService: AuthService,
  ) {
    this.user = this.authService.currentUserValue;
    this.specialServiceCapacityForm = this.fb.group({
      id: [''],
      stationOrigin: ['', Validators.required],
      stationDestiny: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      numberFlight: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.containerPagination = new Pagination();

    this.specialServiceContainers = [];
    this.specialServiceRoutes = [];
    this.specialServiceRoute = new SpecialServiceRoute();
    this.specialService = new SpecialService();
    this.specialService.id = 0;
    this.specialServiceType = null;
    this.stationOrigin = null;
    this.stationDestiny = null;

    this.specialServicesFind = new SpecialService();
    this.specialServiceTypeFind = new SpecialServiceType();
    this.stationOriginFind = new Station();
    this.stationDestinyFind = new Station();

    this.specialServicesRouteAdd = new SpecialServiceRoute();
    this.stationOriginRouteAdd = new Station();
    this.stationDestinyRouteAdd = new Station();

    this.specialServicesRouteFind = new SpecialServiceRoute();
    this.stationOriginRouteFind = new Station();
    this.stationDestinyRouteFind = new Station();
  }

  get f1() {
    return this.specialServiceCapacityForm.controls;
  }

  open() {
    this.specialServiceContainers = [];
    this.specialServiceRoutes = [];
    this.specialServiceRoute = new SpecialServiceRoute();
    this.specialService = new SpecialService();
    this.specialService.id = 0;
    this.specialServiceType = null;
    this.stationOrigin = null;
    this.stationDestiny = null;
    this.stationOriginRouteAdd = null;
    this.stationDestinyRouteAdd = null;
    this.serviceDialog = true;
    this.submittedF1 = false
  }

  close(){
    this.specialServiceContainers = [];
    this.specialServiceRoutes = [];
    this.specialServiceRoute = new SpecialServiceRoute();
    this.specialService = new SpecialService();
    this.specialService.id = 0;
    this.specialServiceType = null;
    this.stationOrigin = null;
    this.stationDestiny = null;
    this.stationOriginRouteAdd = null;
    this.stationDestinyRouteAdd = null;
    this.serviceDialog = false;
  }

  addFlight() {
    if(this.specialService != null){
      this.specialServiceRoute.specialServiceId = this.specialService.id;
    }
    if(this.stationOriginRouteAdd != null){
      this.specialServiceRoute.stationDepartureId = this.stationOriginRouteAdd.id;
    }
    if(this.stationDestinyRouteAdd != null){
      this.specialServiceRoute.stationArrivalId = this.stationDestinyRouteAdd.id;
    }

    this.specialServiceRoute.userCreatedId = this.user.id;
    this.specialServiceRoute.createdDate = new Date(Date.now());
    this.saveFligth();
  }

  saveFligth(){
    this.submittedF1 = true;
    this.loadingF1 = true;
    if (this.specialServiceCapacityForm.invalid) {
      this.loadingF1 = false;
      return;
    }

    this.transactionService.save(environment.adminAPI, this.constantService.SPECIAL_SERVICE_ROUTE_URL, this.specialServiceRoute).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: 'Ruta Creada',
            detail: data.responseDto.message,
          });

          this.stationOriginFind = null;
          this.stationOriginRouteAdd = new Station();
          this.stationDestinyFind = null;
          this.stationDestinyRouteAdd = new Station();
          this.specialServiceRoute = new SpecialServiceRoute();
          this.submittedF1 = false;

          this.loadSpecialSeriveCapacityRoutes();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Servicio especial',
            detail:
              data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Servicio especial',
          detail: 'Por favor inténtelo de nuevo!',
          life: 8000,
        });
      }
    );
  }

  edit(service:SpecialService){
    this.open();
    this.specialService = service;
    this.specialService.arrivalDate = service.arrivalDate;
    this.specialService.awb = service.awb;

  }

  loadContainer(){
    this.transactionService.GetList(environment.adminAPI, this.constantService.SPECIAL_SERVICE_CONTAINER_URL+"/GetBySpecialService/", this.specialService.id.toString()).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.specialServiceContainers = data.businessDto;
          this.containerTotalRecords = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Special Services',
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

  loadServices(event: LazyLoadEvent){
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

    this.loadSpecialSeriveCapacity();
    this.loading = false;
  }

  loadSpecialSeriveCapacity(){
    let filter = new FilterQuery();
    if(this.specialServiceTypeFind !=null){
      this.specialServicesFind.specialServiceTypeId = this.specialServiceTypeFind.id;
    }
    if(this.stationOriginFind !=null){
      this.specialServicesFind.stationOriginId = this.stationOriginFind.id;
    }
    if(this.stationDestinyFind !=null){
      this.specialServicesFind.stationDestinyId = this.stationDestinyFind.id;
    }
    filter = {
      filterDto: this.specialServicesFind,
      paginationDto: this.pagination,
    };
    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.SPECIAL_SERVICE_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.specialServices = data.businessDto;
          this.totalRecords = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Special Services',
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

  loadRoutes(event: LazyLoadEvent){
    this.loading = true;
    this.containerPagination.pageSize = event.rows;
    this.containerPagination.pageNo = event.first / event.rows;
    this.containerPagination.orderTable = [];

    //Para conocer los campos por los cuales se va a filtrar
    if (event.sortField != undefined) {
      let orderTable = new OrderTable();
      orderTable.sorterField = event.sortField;
      orderTable.sorterMode = event.sortOrder === -1 ? 0 : event.sortOrder;
      this.containerPagination.orderTable.push(orderTable);
    }

    this.loadSpecialSeriveCapacityRoutes();
    this.loading = false;
  }

  loadSpecialSeriveCapacityRoutes(){
    let filter = new FilterQuery();
    this.specialServicesRouteFind.specialServiceId = this.specialService.id;
    if(this.stationOriginRouteFind !=null){
      this.specialServicesRouteFind.stationDepartureId = this.stationOriginRouteFind.id;
    }
    if(this.stationDestinyRouteFind !=null){
      this.specialServicesRouteFind.stationArrivalId = this.stationDestinyRouteFind.id;
    }
    filter = {
      filterDto: this.specialServicesRouteFind,
      paginationDto: this.containerPagination,
    };
    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.SPECIAL_SERVICE_ROUTE_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.specialServiceRoutes = data.businessDto;
          this.totalRecords = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Special Services',
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
