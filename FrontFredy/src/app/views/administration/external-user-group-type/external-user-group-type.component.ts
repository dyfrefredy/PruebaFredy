import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { ExternalUserGroupType } from '../../../model/external-user-group-type';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-externalUserGroupType',
  templateUrl: './external-user-group-type.component.html',
  styleUrls: ['./external-user-group-type.component.scss']
})

export class ExternalUserGroupTypeComponent implements OnInit {
  externalUserGroupTypeDialog: boolean;
  newExternalUserGroupType: boolean;
  submitted: boolean;
  loading: boolean;
  externalUserGroupTypeForm: FormGroup;
  externalUserGroupTypes: ExternalUserGroupType[];
  externalUserGroupType: ExternalUserGroupType;
  externalUserGroupTypeFind: ExternalUserGroupType;
  selectedExternalUserGroupTypes: ExternalUserGroupType[];

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
    this.externalUserGroupTypeForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      active: [false]
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.externalUserGroupTypeFind = new ExternalUserGroupType();
  }

  get f() {
    return this.externalUserGroupTypeForm.controls;
  }

  openNew() {
    this.externalUserGroupType = new ExternalUserGroupType();
    this.submitted = false;
    this.externalUserGroupTypeDialog = true;
  }

  hideDialog() {
    this.externalUserGroupTypeDialog = false;
    this.submitted = false;
  }

  saveExternalUserGroupType(externalUserGroupType: ExternalUserGroupType) {
    this.submitted = true;
    this.loading = true;

    if (this.externalUserGroupTypeForm.invalid) {
      this.loading = false;
      return;
    }


    if (this.externalUserGroupType.id) {
      this.transactionService.update(environment.adminAPI, this.constantService.EXTERNAL_USER_GROUP_TYPE, this.externalUserGroupType).subscribe(
        (data) => {
          if (
            data.responseDto.response === this.constantService.RESPONSE_OK
          ) {
            this.externalUserGroupTypeForm.reset(
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
              summary: 'Estación',
              detail: data.responseDto.message
            });
            this.getPaginationAndFilter();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Estación',
              detail:
                data.responseDto.message + ' , por favor inténtelo de nuevo!',
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
      this.transactionService.save(environment.adminAPI, this.constantService.EXTERNAL_USER_GROUP_TYPE, externalUserGroupType).subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.externalUserGroupTypeForm.reset(
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
                summary: 'Estación',
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Estación.',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
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

  editExternalUserGroupType(externalUserGroupType: ExternalUserGroupType) {
    this.externalUserGroupType = { ...externalUserGroupType };
    this.externalUserGroupTypeDialog = true;
    this.newExternalUserGroupType = false;
  }

  private getExternalUserGroupType() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.EXTERNAL_USER_GROUP_TYPE).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.externalUserGroupTypes = data.businessDto;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Estación',
            detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
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

  deleteSelectedExternalUserGroupTypes() {
    if (this.selectedExternalUserGroupTypes || this.selectedExternalUserGroupTypes.length) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea inactivar los externalUserGroupTypes seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedExternalUserGroupTypes.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService.delete(environment.adminAPI, this.constantService.ROLE_URL, ids).subscribe(
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
                  detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
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
          this.selectedExternalUserGroupTypes = null;
        },
      });
    }
  }

  deleteExternalUserGroupType(externalUserGroupType: ExternalUserGroupType) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea inactivar el rol ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(externalUserGroupType.id);

        this.transactionService
          .delete(environment.adminAPI, this.constantService.ROLE_URL, ids)
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
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
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
      filterDto: this.externalUserGroupTypeFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.EXTERNAL_USER_GROUP_TYPE, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.externalUserGroupTypes = data.businessDto;
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

  loadExternalUserGroupTypes(event: LazyLoadEvent) {
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
