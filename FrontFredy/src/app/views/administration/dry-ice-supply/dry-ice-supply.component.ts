import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';
import { DryIceSupply } from '../../../model/dry-ice-supply';
import { Station } from '../../../model/station';
import { DryIceSupplyStation } from '../../../model/dry-ice-supply-station';
import { filter } from 'rxjs/operators';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-dryIceSupply',
  templateUrl: './dry-ice-supply.component.html',
  styleUrls: ['./dry-ice-supply.component.css']
})
export class DryIceSupplyComponent implements OnInit {
  dryIceSupplyDialog: boolean;
  dryIceSupplyTable: boolean;
  newDryIceSupply: boolean;
  submitted: boolean;
  loading: boolean;
  dryIceSupplyForm: FormGroup;
  dryIceSupplys: DryIceSupply[];
  dryIceSupply: DryIceSupply;
  dryIceSupplyFind: DryIceSupply;
  selectedDryIceSupplys: DryIceSupply[];
  selectedStations: Station[];
  selectionstationsAvailable: Station;
  control:FormControl;
  station: Station;
  user: User;

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private confirmationService: ConfirmationService,
    private authService: AuthService,
  ) {
    this.dryIceSupplyForm = this.fb.group({
      airWaybill: ['', Validators.required],
      amountIce: ['', Validators.required],
      active: [''],
      dryIceSupplyStations: [''],
    });

    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.dryIceSupplyFind = new DryIceSupply();
    this.selectedStations = [];
    this.selectionstationsAvailable = new Station();
    this.station = new Station();
    this.dryIceSupplyTable = false;
  }

  get f() {
    return this.dryIceSupplyForm.controls;
  }

  openNew() {
    this.dryIceSupply = new DryIceSupply();
    this.dryIceSupply.airWaybill = "0";
    this.station = new Station();
    this.selectedStations = [];
    this.submitted = false;
    this.dryIceSupplyDialog = true;
    this.dryIceSupplyTable = false
  }

  hideDialog() {
    this.dryIceSupplyDialog = false;
    this.submitted = false;
  }

  editDryIceSupply(dryIceSupply) {
    this.dryIceSupply = { ...dryIceSupply };
    this.dryIceSupplyTable = true;
    this.selectedStations = [];
    this.station = dryIceSupply.station;
    console.log(this.dryIceSupply);
  
    this.newDryIceSupply = false;
    this.dryIceSupplyDialog = true;
    if(this.dryIceSupply.waybillRpaDryIceSupply == null || this.dryIceSupply.waybillRpaDryIceSupply == undefined || this.dryIceSupply.waybillRpaDryIceSupply.length == 0)
    this.dryIceSupplyTable = false;
  }

  saveDryIceSupply() {
    this.submitted = true;
    this.loading = true;

    if (this.dryIceSupplyForm.invalid && !this.station) {
      this.loading = false;
      return;
    }

    if (this.dryIceSupply.id) {
      this.transactionService.update(environment.adminAPI, this.constantService.DRY_ICE_SUPPLY_URL, this.dryIceSupply).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.dryIceSupplyForm.reset(
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
              summary: 'Reabastecimiento de hielo seco',
              detail: data.responseDto.message
            });
            this.getPaginationAndFilter();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Reabastecimiento de hielo seco',
              detail:
                data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Reabastecimiento de hielo seco',
            detail: 'Por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      );
    } else {
      this.dryIceSupply.stationId = this.station.id;
      this.dryIceSupply.CreatedUserId = this.user.id;

      this.transactionService.save(environment.adminAPI, this.constantService.DRY_ICE_SUPPLY_URL, this.dryIceSupply).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.dryIceSupplyForm.reset(
              { onlySelf: false, emitEvent: false }
            );

            this.messageService.add({
              severity: 'success',
              summary: 'Reabastecimiento de hielo seco',
              detail: data.responseDto.message,
            });
            this.getPaginationAndFilter();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Reabastecimiento de hielo seco',
              detail:
                data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Reabastecimiento de hielo seco',
            detail: 'Por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      );
    }
    this.hideDialog();
    this.loading = false;
  }

  deleteSelectedDryIceSupplys() {
    if (this.selectedDryIceSupplys || this.selectedDryIceSupplys.length) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea inactivar los reabastecimientos seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedDryIceSupplys.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.adminAPI, this.constantService.DRY_ICE_SUPPLY_URL, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Reabastecimiento de hielo seco',
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Reabastecimiento de hielo seco',
                    detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Reabastecimiento de hielo seco',
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.selectedDryIceSupplys = null;
        },
      });
    }
  }

  deleteDryIceSupply(dryIceSupply: DryIceSupply) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea inactivar el reabastecimiento de hielo seco?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(dryIceSupply.id);

        this.transactionService
          .delete(environment.adminAPI, this.constantService.DRY_ICE_SUPPLY_URL, ids)
          .subscribe((data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageService.add({
                severity: 'success',
                summary: 'Reabastecimiento de hielo seco',
                detail: data.responseDto.message,
                life: 3000,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Reabastecimiento de hielo seco',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
            (error) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Reabastecimiento de hielo seco',
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
      filterDto: this.dryIceSupplyFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.DRY_ICE_SUPPLY_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.dryIceSupplys = data.businessDto;
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

  loadDryIceSupplys(event: LazyLoadEvent) {
    this.loading = true;
    this.pagination.pageSize = event.rows;
    this.pagination.pageNo = (event.first / event.rows);
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
}
