import { Component } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { Station } from '../../../model/station';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';

@Component({
  templateUrl: './station.component.html',
  styleUrls: ['./station.component.scss']
})
export class StationComponent {
  stationDialog: boolean;
  newStation: boolean;
  submitted: boolean;
  loading: boolean;
  stationForm: FormGroup;
  stations: Station[];
  station: Station;
  stationFind: Station;
  selectedStations: Station[];

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  ngOnInit() {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.stationFind = new Station();
  }

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private confirmationService: ConfirmationService
  ) {
    this.stationForm = this.fb.group({
      id: [''],
      name: [''],
      description: [''],
      baseAdmonCod: [''],
      active: [false],
      principal: [false],
    });
  }

  get f() {
    return this.stationForm.controls;
  }

  openNew() {
    this.station = new Station();
    this.submitted = false;
    this.stationDialog = true;
  }

  hideDialog() {
    this.stationDialog = false;
    this.submitted = false;
  }

  saveStation(station: Station) {
    this.submitted = true;
    this.loading = true;

    if (this.stationForm.invalid) {
      this.loading = false;
      return;
    }

    this.station = new Station();
    this.station.id = Number(this.f.id.value);
    this.station.name = this.f.name.value,
    this.station.description = this.f.description.value,
    this.station.baseAdmonCod = this.f.baseAdmonCod.value,
    this.station.active = Boolean(this.f.active.value);
      if (this.station.id) {
        this.transactionService
          .update(environment.adminAPI, this.constantService.STATION_URL, this.station)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.stationForm.reset(
                  {
                    Name: null,
                    description: null,
                    baseAdmonCod: null,
                    acive: null,
                  },
                  { onlySelf: false, emitEvent: false }
                );
                this.submitted = false;
                this.messageService.add({
                  severity: 'success',
                  summary:'Estación',
                  detail: data.responseDto.message
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Estación',
                  detail:
                    data.responseDto.message +' , por favor inténtelo de nuevo!',
                  life: 8000,
                });
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Estación',
                detail: 'Por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          );
      } else {
        this.transactionService
          .save(environment.adminAPI, this.constantService.STATION_URL, station)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.stationForm.reset(
                  {
                    Name: null,
                    description: null,
                    baseAdmonCod: null,
                    acive: null,
                  },
                  { onlySelf: false, emitEvent: false }
                );
                this.submitted = false;
                this.messageService.add({
                  severity: 'success',
                  summary:'Estación',
                  detail: data.responseDto.message
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'error',
                  summary: 'Estación.',
                  detail: data.responseDto.message +' , por favor inténtelo de nuevo!',
                  life: 8000,
                });
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Estación.',
                detail: 'Por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          );
      }
    this.hideDialog();
    this.loading = false;
  }

  editStation(station: Station) {
    this.station = { ...station };
    this.stationDialog = true;
    this.newStation = false;
  }

  private getStation() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.STATION_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.stations = data.businessDto;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Estación',
            detail: data.responseDto.message +' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Estación',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  deleteSelectedStations() {
    if (this.selectedStations || this.selectedStations.length) {
      this.confirmationService.confirm({
        message:'¿Está seguro de que desea eliminar las estaciones seleccionadas?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedStations.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.adminAPI, this.constantService.STATION_URL, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Estación',
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Estación',
                    detail: data.responseDto.message +' , por favor inténtelo de nuevo!',
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Estación',
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.selectedStations = null;
        },
      });
    }
  }

  deleteStation(station: Station) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar la Estacion ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(station.id);

        this.transactionService
          .delete(environment.adminAPI, this.constantService.STATION_URL, ids)
          .subscribe((data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageService.add({
                severity: 'success',
                summary: 'Estación',
                detail: data.responseDto.message,
                life: 3000,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Estación',
                detail: data.responseDto.message +' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.loading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Estación',
              detail: 'Por favor, intente más tarde.',
            });
          }
        );
      },
    });
  }


  getPaginationAndFilter() {

    let filter = new FilterQuery();

    filter = {
      filterDto: this.stationFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.STATION_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.stations = data.businessDto;
          this.totalRecords = data.totalRecords;
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

  loadStations(event: LazyLoadEvent) {
    this.loading = true;
    this.pagination.pageSize = event.rows;
    this.pagination.pageNo = (event.first / event.rows);
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
}
