import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SpecialServiceContainer } from '../../../model/special-service-container';
import { SpecialServiceRoute } from '../../../model/special-service-route';
import { SpecialService } from '../../../model/special-service';
import { TransactionService } from '../../../services/transaction.service';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { SpecialServiceType } from '../../../model/special-service-type';
import { Station } from '../../../model/station';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { FilterQuery } from '../../../model/filter-query';
import { OrderTable } from '../../../model/order-table';
import { Pagination } from '../../../model/pagination';

@Component({
  selector: 'app-services',
  templateUrl: './special-services.component.html',
  styleUrls: ['./special-services.component.scss']
})
export class SpecialServicesComponent implements OnInit {
  user: User;
  containerForm:FormGroup;
  specialServiceForm:FormGroup;
  specialService:SpecialService;
  specialServices:SpecialService[];
  specialServicesFind:SpecialService;
  specialServiceContainers:SpecialServiceContainer[];
  specialServiceRoutes:SpecialServiceRoute[];
  specialServiceType:SpecialServiceType;
  specialServiceTypeFind:SpecialServiceType;
  stationOriginFind:Station;
  stationDestinyFind:Station;
  stationOrigin:Station;
  stationDestiny:Station;
  serviceDialog:boolean;
  repositioning:boolean;
  onlyView:boolean;

  submitted: boolean;
  loading: boolean;

  submittedF1: boolean;
  loadingF1: boolean;

  submittedF2: boolean;
  loadingF2: boolean;

  pagination: Pagination;
  totalRecords: Number;

  filterFlightPagination: Pagination;
  filterFlightTotalRecords: Number;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private authService: AuthService,
    private confirmationService: ConfirmationService) {
    this.user = this.authService.currentUserValue;
    this.containerForm = this.fb.group({
      containerNumber: ['', Validators.required],
    });

    this.specialServiceForm = this.fb.group({
      id: [''],
      specialServiceType: ['', Validators.required],
      stationOrigin: ['', Validators.required],
      stationDestiny: ['', Validators.required],
      arrivalDate: ['', Validators.required],
      awb: ['', Validators.required],
      containerList: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.filterFlightPagination = new Pagination();

    this.specialServiceContainers = [];
    this.specialServiceRoutes = [];
    this.specialService = new SpecialService();
    this.specialService.id = 0;
    this.specialServiceType = null;
    this.stationOrigin = null;
    this.stationDestiny = null;

    this.specialServicesFind = new SpecialService();
    this.specialServiceTypeFind = new SpecialServiceType();
    this.stationOriginFind = new Station();
    this.stationDestinyFind = new Station();


  }

  get f2() {
    return this.containerForm.controls;
  }

  get f1() {
    return this.specialServiceForm.controls;
  }

  open() {
    this.specialServiceContainers = [];
    this.specialServiceRoutes = [];
    this.specialService = new SpecialService();
    this.specialService.id = 0;
    this.specialServiceType = null;
    this.stationOrigin = null;
    this.stationDestiny = null;
    this.f2.containerNumber.setValue("");
    this.serviceDialog = true;
    this.repositioning = false;
    this.onlyView=false;
    this.submittedF1 = false;
  }

  close() {
    this.serviceDialog = false;
  }

  loadContainer(){
    this.transactionService.GetList(environment.adminAPI, this.constantService.SPECIAL_SERVICE_CONTAINER_URL+"/GetBySpecialService/", this.specialService.id.toString()).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.specialServiceContainers = data.businessDto;
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

  filterFlightPlan(){
    this.transactionService.GetList(environment.adminAPI, this.constantService.SPECIAL_SERVICE_ROUTE_URL+"/GetBySpecialServiceId/", this.specialService.id.toString()).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.specialServiceRoutes = data.businessDto;
          this.filterFlightTotalRecords = data.totalRecords;
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

  addContainer() {
    this.submittedF2 = true;
    this.loadingF2 = true;

    if (this.containerForm.invalid) {
      this.loadingF2 = false;
      return;
    }

    var item = this.specialServiceContainers.filter(val => val.container === this.f2.containerNumber.value);
    if(item.length == 0){
      let specialServiceContainer =new SpecialServiceContainer();
      specialServiceContainer.container = this.f2.containerNumber.value;
      this.specialServiceContainers.push(specialServiceContainer);
    }
    this.f2.containerNumber.setValue("");
    this.submittedF2 = false;
  }

  deleteContainer(rowIndex:any) {
    this.specialServiceContainers.splice(rowIndex,1);
  }


  addSpecialService() {
    this.submittedF1 = true;
    this.loadingF1 = true;
    if(this.specialServiceContainers.length > 0){
      this.f1.containerList.setValue("Ok");
    }else{
      this.f1.containerList.setValue("");
    }
    if (this.specialServiceForm.invalid) {
      this.loadingF1 = false;
      return;
    }

    this.specialService.specialServiceTypeId = this.specialServiceType.id;
    this.specialService.stationOriginId = this.stationOrigin.id;
    this.specialService.stationDestinyId = this.stationDestiny.id;
    this.specialService.userCreatedId = this.user.id;
    this.specialService.specialServiceContainers = this.specialServiceContainers;
    this.specialService.repositioningId = null;

    if (this.specialService.id) {
      this.specialService.userUpdateId = this.user.id;
      this.specialService.updatedDate = new Date(Date.now());
      this.transactionService.update(environment.adminAPI, this.constantService.SPECIAL_SERVICE_URL, this.specialService).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.getPaginationAndFilter();
            this.close();
            this.messageService.add({
              severity: 'success',
              summary: 'Servicio especial creado',
              detail: data.responseDto.message,
            });
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
    }else{
      this.transactionService.save(environment.adminAPI, this.constantService.SPECIAL_SERVICE_URL, this.specialService).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.getPaginationAndFilter();
            this.close();
            this.messageService.add({
              severity: 'success',
              summary: 'Servicio especial creado',
              detail: data.responseDto.message,
            });
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
  }

  deleteService(specialService: SpecialService){
    this.specialService.active = false;
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar el registro ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(specialService.id);
        this.transactionService
          .delete(environment.adminAPI, this.constantService.SPECIAL_SERVICE_URL, ids)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Servicios especiales',
                  detail: data.responseDto.message,
                  life: 8000,
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Servicios especiales',
                  detail: data.responseDto.message,
                  life: 8000,
                });
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Servicios especiales',
                detail: 'Por favor, intente más tarde.',
              });
            }
          );
      },
    });
  }

  view(service){
    this.edit(service);
    this.onlyView=true;
    this.repositioning = true;
  }

  edit(service){
    this.open();
    this.specialService.id = service.id;
    this.specialServiceType =  service.specialServiceType;
    this.stationOrigin = service.stationOrigin;
    this.stationDestiny = service.stationDestiny;
    this.specialService.arrivalDate = new Date(Date.parse(service.arrivalDate));
    this.specialService.awb = service.awb;
    this.specialServiceContainers = service.specialServiceContainers;
    this.specialServiceRoutes = service.specialServiceRoutes;
  }

  reposition(service){
    this.open();
    this.repositioning = true;
    this.specialService.id = service.id;
    let specialServiceType = new SpecialServiceType();
    specialServiceType.id = 2;
    specialServiceType.description = "Reposicionamiento";
    this.specialServiceType =  specialServiceType;
    this.stationOrigin = service.stationOrigin;
    this.stationDestiny = service.stationDestiny;
    this.specialService.arrivalDate = new Date(Date.parse(service.arrivalDate));
    this.specialService.awb = service.awb;
    this.specialServiceContainers = service.specialServiceContainers;
    this.specialServiceRoutes = service.specialServiceRoutes;
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

    this.getPaginationAndFilter();
    this.loading = false;
  }

  getPaginationAndFilter(){
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
}
