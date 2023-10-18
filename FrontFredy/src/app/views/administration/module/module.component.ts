import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { Module } from '../../../model/module';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.scss']
})
export class ModuleComponent implements OnInit {
  moduleDialog: boolean;
  newModule: boolean;
  submitted: boolean;
  loading: boolean;
  moduleForm: FormGroup;
  modules: Module[];
  module: Module;
  moduleFind: Module;
  selectedModules: Module[];


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
    this.moduleForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      url: ['', Validators.required],
      icon: [''],
      description: [''],
      active: [false],
      moduleId: [''],
      projectType: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.moduleFind = new Module();
  }

  get f() {
    return this.moduleForm.controls;
  }

  openNew() {
    this.module = new Module();
    this.module.active = false;
    this.submitted = false;
    this.moduleDialog = true;
  }

  hideDialog() {
    this.moduleDialog = false;
    this.submitted = false;
  }

  saveModule() {
    this.submitted = true;
    this.loading = true;

    if (this.moduleForm.invalid) {
      this.loading = false;
      return;
    }


    if (this.module.id) {
      this.transactionService
        .update(environment.adminAPI, this.constantService.MODULE_URL, this.module)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.moduleForm.reset(
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
                summary: 'Módulo',
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Módulo',
                detail:
                  data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Módulo',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    } else {
      this.transactionService
        .save(environment.adminAPI, this.constantService.MODULE_URL, this.module)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.moduleForm.reset(
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
                summary: 'Módulo',
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Módulo.',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Módulo.',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    }
    this.hideDialog();
    this.loading = false;
  }

  editModule(module: Module) {
    this.module = { ...module };
    this.moduleDialog = true;
    this.newModule = false;
  }

  deleteSelectedModules() {
    if (this.selectedModules || this.selectedModules.length) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea inactivar las estaciones seleccionadas?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedModules.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.adminAPI, this.constantService.MODULE_URL, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Módulo',
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Módulo',
                    detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Módulo',
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.selectedModules = null;
        },
      });
    }
  }

  deleteModule(module: Module) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea inactivar el Modulo ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(module.id);

        this.transactionService
          .delete(environment.adminAPI, this.constantService.MODULE_URL, ids)
          .subscribe((data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageService.add({
                severity: 'success',
                summary: 'Módulo',
                detail: data.responseDto.message,
                life: 3000,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Módulo',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
            (error) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Módulo',
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
      filterDto: this.moduleFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.MODULE_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.modules = data.businessDto;
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

  loadModules(event: LazyLoadEvent) {
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
