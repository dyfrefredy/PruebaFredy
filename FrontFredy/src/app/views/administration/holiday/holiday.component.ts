import { Component, OnInit } from '@angular/core';
import { Holiday } from '../../../model/holiday';
import { TransactionService } from '../../../services/transaction.service';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { Pagination } from '../../../model/pagination';
import { FilterQuery } from '../../../model/filter-query';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';


@Component({
  selector: 'app-holiday',
  templateUrl: './holiday.component.html',
  styleUrls: ['./holiday.component.scss'],
})
export class HolidayComponent implements OnInit {

  dateDialog: boolean;
  loading: boolean;

  holidays: Holiday[];
  dateFilter: Holiday;
  submitted: boolean;

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
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.dateFilter = new Holiday();
  }

  saveDate(fecha: Holiday) {
    this.submitted = true;
    this.dateFilter = { ...fecha };
    if (this.dateFilter.dateStart == null || this.dateFilter.dateEnd == null) {
      this.loading = false;
      return;
    }
    this.saverHoliday(fecha);
  }

  saverHoliday(fecha: Holiday) {
    this.loading = true;
    if (fecha.id != null && fecha.id != 0) {
      this.transactionService
        .update(environment.adminAPI, this.constantService.DATE_URL, fecha)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'El registro de Fecha se ha actualizado correctamente',
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al actualizar la fecha',
                detail:
                  data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Fecha.',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    } else {
      this.transactionService
        .save(environment.adminAPI, this.constantService.DATE_URL, fecha)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageService.add({
                severity: 'success',
                summary: 'El registro de Fecha se ha realizado correctamente',
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error al registrar la fecha.',
                detail:
                  data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error al registrar la fecha.',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    }
  }

  deleteDate(holiday: Holiday) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar la Fecha ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.holidays = this.holidays.filter((val) => val.id !== holiday.id);
        let ids = [];
        ids.push(holiday.id);
        this.transactionService
          .delete(environment.adminAPI, this.constantService.DATE_URL, ids)
          .subscribe((data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.messageService.add({
                severity: 'success',
                summary: 'Fechas',
                detail: data.responseDto.message,
                life: 8000,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Fechas',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
            (error) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Fechas',
                detail: 'Por favor, intente más tarde.',
              });
            }
          );
      },
    })
  }

  getFechasById(idStation: number): any {
    this.transactionService
      .get(environment.adminAPI, this.constantService.DATE_URL, idStation)
      .subscribe(
        //getAll(this.constantService.STATION_URL).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.holidays = data.businessDto;
          } else {
            this.messageService.add({
              severity: 'success',
              summary: 'Fechas',
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

  GetFechasListado() {
    this.submitted = true;
    this.loading = true;
    if (this.dateFilter.dateStart == null || this.dateFilter.dateEnd == null) {
      this.loading = false;
      return;
    }

    this.getPaginationAndFilter();

  }

  getPaginationAndFilter() {
    this.loading = true;
    let filter = new FilterQuery();
    //let this.airline = { ...airline };
    filter = {
      filterDto: this.dateFilter,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.DATE_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.holidays = data.businessDto;
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
          summary: 'Fechas',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
    this.loading = false;
  }

  loadHoliday(event: LazyLoadEvent) {
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
  }
}
