import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { SpecialServiceContainer } from '../../../model/special-service-container';
import { SpecialServiceRoute } from '../../../model/special-service-route';
import { SpecialService } from '../../../model/special-service';
import { TransactionService } from '../../../services/transaction.service';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { FilterQuery } from '../../../model/filter-query';
import { AirWaybillSearch } from '../../../model/air-waybill-search';
import { SpecialServiceRouteStatus } from '../../../model/special-service-route-status';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { Station } from '../../../model/station';
import moment from 'moment';


@Component({
  selector: 'app-special-service-operation',
  templateUrl: './special-service-operation.component.html',
  styleUrls: ['./special-service-operation.component.scss']
})
export class SpecialServiceOperationComponent implements OnInit {
  @Input() filters: {
    specialServiceRouteStatuses: SpecialServiceRouteStatus[],
    airWaybillSearch: AirWaybillSearch
  };

  user: User;
  specialServiceContainers: SpecialServiceContainer[];
  specialServiceRouteStatus: SpecialServiceRouteStatus;
  specialServiceRouteStatusFind: SpecialServiceRouteStatus;
  stationDestiny: Station;

  submitted: boolean;
  loading: boolean;
  specialServiOperationDialog: boolean;

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;
  constructor(
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private authService: AuthService) {

    this.user = this.authService.currentUserValue;
    this.specialServiceRouteStatus = new SpecialServiceRouteStatus();
    this.specialServiceRouteStatusFind = new SpecialServiceRouteStatus();
    this.specialServiceRouteStatusFind.specialServiceRoute = new SpecialServiceRoute();
    this.specialServiceRouteStatusFind.specialServiceRoute.specialService = new SpecialService();
    this.stationDestiny = new Station();
    this.specialServiOperationDialog = false;
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
  }

  openSpecialServiceOperationDialog() {
    this.specialServiOperationDialog = true;
  }

  closeSpecialServiceOperationDialog() {
    this.specialServiOperationDialog = false;
  }


  popupSpecialServiceOperation(service) {
    this.openSpecialServiceOperationDialog();
    this.specialServiceRouteStatus = { ...service };
  }

  saveSpecialServiceOperationDialog() {
    this.specialServiceRouteStatus.specialServiceRouteId = this.specialServiceRouteStatus.specialServiceRoute.id;
    this.specialServiceRouteStatus.userCreatedId = this.user.id;
    this.specialServiceRouteStatus.CreatedDate = moment().toISOString(true);
    this.specialServiceRouteStatus.stationId = this.filters.airWaybillSearch.station;
    if (this.specialServiceRouteStatus.id) {
      this.transactionService.update(environment.pharmaAPI, this.constantService.SPECIAL_SERVICE_ROUTE_STATE_URL, this.specialServiceRouteStatus).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario',
              detail: data.responseDto.message,
            });
            this.loadRoutesPaginationAndFilter();
            this.closeSpecialServiceOperationDialog();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Usuario',
              detail:
                data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Usuario',
            detail: 'Por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      );
    } else {
      this.transactionService.save(environment.pharmaAPI, this.constantService.SPECIAL_SERVICE_ROUTE_STATE_URL, this.specialServiceRouteStatus).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.messageService.add({
              severity: 'success',
              summary: 'Usuario',
              detail: data.responseDto.message,
            });
            this.loadRoutesPaginationAndFilter();
            this.closeSpecialServiceOperationDialog();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Usuario',
              detail:
                data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Usuario',
            detail: 'Por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      );
    }
  }

  loadRoutes(event: LazyLoadEvent) {
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

    this.loadRoutesPaginationAndFilter();
    this.loading = false;
  }

  loadRoutesPaginationAndFilter() {
    if (this.filters.airWaybillSearch.station != null) {
      this.specialServiceRouteStatusFind.stationId = this.filters.airWaybillSearch.station;
      if (this.stationDestiny != null) {
        this.specialServiceRouteStatusFind.specialServiceRoute.stationArrivalId = this.stationDestiny.id;
      }

      let filter = new FilterQuery();
      filter = {
        filterDto: this.specialServiceRouteStatusFind,
        paginationDto: this.pagination,
      };
      this.transactionService.getPaginationAndFilter(environment.pharmaAPI, this.constantService.SPECIAL_SERVICE_ROUTE_STATE_URL, filter).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.filters.specialServiceRouteStatuses = data.businessDto;
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

  loadContainer() {
    this.transactionService.GetList(environment.adminAPI, this.constantService.SPECIAL_SERVICE_CONTAINER_URL + "/GetBySpecialService/", this.specialServiceRouteStatus.specialServiceRoute.specialService.id.toString()).subscribe(
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
}
