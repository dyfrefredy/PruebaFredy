import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { Airline } from '../../../model/airline';
import { TransactionService } from '../../../services/transaction.service';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { SortEvent } from 'primeng/api/sortevent';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';



@Component({
  selector: 'app-airline',
  templateUrl: './airline.component.html',
  styleUrls: ['./airline.component.scss'],
})
export class AirlineComponent implements OnInit {
  airlineDialog: boolean;
  submitted: boolean;
  loading: boolean;
  airlineForm: FormGroup;
  airlines: Airline[];
  selectedAirlines: Airline[];
  airline: Airline;
  airlineFilter: Airline;
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
    this.airlineForm = this.fb.group({
      id: ['', null],
      airlineCod: ['', Validators.required],
      iataCod: ['', Validators.required],
      nit: ['', Validators.required],
      dv: ['', Validators.required],
      name: ['', Validators.required],
      active: [false, Validators.required],
    });
  }

  get f() {
    return this.airlineForm.controls;
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.airlineFilter = new Airline();
  }

  openNew() {
    this.airline = new Airline();
    this.airline.id = 0;
    this.airline.active = false;
    this.submitted = false;
    this.airlineDialog = true;
  }

  hideDialog() {
    this.airlineDialog = false;
    this.submitted = false;
  }

  saveAirline() {
    this.submitted = true;
    this.loading = true;
    // stop here if airlineform is invalid
    if (this.airlineForm.invalid) {
      this.loading = false;
      return;
    }

    this.airline = new Airline();
    this.airline.id = Number(this.f.id.value);
    this.airline.airlineCod = this.f.airlineCod.value;
    this.airline.iataCod = this.f.iataCod.value;
    this.airline.nit = Number(this.f.nit.value);
    this.airline.dv = Number(this.f.dv.value);
    this.airline.name = this.f.name.value;
    this.airline.active = this.f.active.value;

    if (this.airline.id) {
      this.transactionService
        .update(environment.adminAPI, this.constantService.AIRLINE_URL, this.airline)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.airlineForm.reset(
                {
                  userName: null,
                  email: null,
                  password: null,
                  repeatPassword: null,
                },
                { onlySelf: false, emitEvent: false }
              );
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Aerolínea',
                detail: data.responseDto.message,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Aerolínea',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Aerolínea',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    } else {
      this.transactionService
        .save(environment.adminAPI, this.constantService.AIRLINE_URL, this.airline)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.airlineForm.reset(
                {
                  userName: null,
                  email: null,
                  password: null,
                  repeatPassword: null,
                },
                { onlySelf: false, emitEvent: false }
              );
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Aerolínea',
                detail: data.responseDto.message,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Aerolínea',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Aerolínea',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    }
    this.hideDialog();
    this.loading = false;
  }

  editAirline(airline: any) {
    this.airline = { ...airline };
    this.airlineDialog = true;
    //this.newAirline = false;
  }

  deleteSelectedAirlines() {
    if (this.selectedAirlines && this.selectedAirlines.length > 0) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea eliminar las aerolíneas seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedAirlines.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.adminAPI, this.constantService.AIRLINE_URL, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Aerolínea',
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Aerolíneas',
                    detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Aerolíneas',
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.hideDialog();
          this.selectedAirlines = null;
        },
      });
    }
  }

  deleteAirline(airline: Airline) {
    this.confirmationService.confirm({
      message: '¿Estás segura de que quieres eliminar la erolínea ' + airline.name + '?', header: 'Aerolínea',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(airline.id);
        this.transactionService
          .delete(environment.adminAPI, this.constantService.AIRLINE_URL, ids)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Aerolíneas',
                  detail: data.responseDto.message,
                  life: 3000,
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Aerolíneas',
                  detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                  life: 8000,
                });
              }
            },
            (error) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Aerolíneas',
                detail: 'Por favor, intente más tarde.',
              });
            }
          );
        this.airline = null;
      },
    });
  }


  getPaginationAndFilter() {
    let filter = new FilterQuery();
    //let this.airline = { ...airline };
    filter = {
      filterDto: this.airlineFilter,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.AIRLINE_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.airlines = data.businessDto;
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

  loadAirlines(event: LazyLoadEvent) {

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
