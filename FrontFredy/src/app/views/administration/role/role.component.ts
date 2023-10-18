import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { Role } from '../../../model/role';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  roleDialog: boolean;
  newRole: boolean;
  submitted: boolean;
  loading: boolean;
  roleForm: FormGroup;
  roles: Role[];
  role: Role;
  roleFind: Role;
  selectedRoles: Role[];

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
    this.roleForm = this.fb.group({
      id: [''],
      description: ['', Validators.required],
      active: [false]
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.roleFind = new Role();
  }

  get f() {
    return this.roleForm.controls;
  }

  openNew() {
    this.role = new Role();
    this.submitted = false;
    this.roleDialog = true;
  }

  hideDialog() {
    this.roleDialog = false;
    this.submitted = false;
  }

  saveRole(role: Role) {
    this.submitted = true;
    this.loading = true;

    if (this.roleForm.invalid) {
      this.loading = false;
      return;
    }


    if (this.role.id) {
      this.transactionService
        .update(environment.adminAPI, this.constantService.ROLE_URL, this.role)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.roleForm.reset(
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
      this.transactionService
        .save(environment.adminAPI, this.constantService.ROLE_URL, role)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.roleForm.reset(
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

  editRole(role: Role) {
    this.role = { ...role };
    this.roleDialog = true;
    this.newRole = false;
  }

  private getRole() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.ROLE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.roles = data.businessDto;
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

  deleteSelectedRoles() {
    if (this.selectedRoles || this.selectedRoles.length) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea inactivar los roles seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedRoles.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.adminAPI, this.constantService.ROLE_URL, ids)
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
          this.selectedRoles = null;
        },
      });
    }
  }

  deleteRole(role: Role) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea inactivar el rol ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(role.id);

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
      filterDto: this.roleFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.ROLE_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.roles = data.businessDto;
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

  loadRoles(event: LazyLoadEvent) {
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
