import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { FilterQuery } from '../../../model/filter-query';
import { OrderTable } from '../../../model/order-table';
import { Pagination } from '../../../model/pagination';
import { RoleModule } from '../../../model/role-module';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-role-module',
  templateUrl: './role-module.component.html',
  styleUrls: ['./role-module.component.scss']
})
export class RoleModuleComponent implements OnInit {
  roleModuleDialog: boolean;
  submitted: boolean;
  loading: boolean;
  roleModuleForm: FormGroup;
  roleModules: RoleModule[];
  roleModule: RoleModule;
  roleModuleFind: RoleModule;
  selectedRoleModules: RoleModule[];
  formRoleModule: FormGroup;
  pagination: Pagination;

  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  statesFind: Array<{ label: string; value: any }>;
  cities: Array<{ label: string; value: any }>;
  citiesFind: Array<{ label: string; value: any }>;
  userLogin: User;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private authService: AuthService
  ) {
    this.roleModuleForm = this.fb.group({
      roleId: ['', Validators.required],
      moduleId: ['', Validators.required],
      active: [false],
      read: [false],
      write: [false],
      edit: [false],
      delete: [false]
    });

    this.userLogin = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.roleModuleFind = new RoleModule();
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
  }

  get f() {
    return this.roleModuleForm.controls;
  }

  loadRoleModules(event: LazyLoadEvent) {
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

  getPaginationAndFilter() {
    let filter = new FilterQuery();
    filter = {
      filterDto: this.roleModuleFind,
      paginationDto: this.pagination,
    };

    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, this.constantService.ROLE_MODULE_URL, filter)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.roleModules = data.businessDto;
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

  openNew() {
    this.roleModule = new RoleModule();
    this.roleModule.active = false;
    this.roleModule.id = 0;
    this.submitted = false;
    this.roleModuleDialog = true;
  }

  editRoleModule(roleModule: any) {
    this.roleModule = { ...roleModule };
    this.roleModuleDialog = true;

  }

  hideDialog() {
    this.roleModuleDialog = false;
    this.submitted = false;
  }

  saveRoleModule() {
    this.submitted = true;
    this.loading = true;

    // stop here if airlineform is invalid
    if (this.roleModuleForm.invalid) {
      this.loading = false;
      return;
    }

    if (this.roleModule.id) {
      this.roleModule.updatedUserId = this.userLogin.id;
      this.transactionService
        .update(environment.adminAPI, this.constantService.ROLE_MODULE_URL, this.roleModule)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.roleModuleForm.reset(
                {
                  roleModuleName: null,
                  email: null,
                  password: null,
                  repeatPassword: null,
                },
                { onlySelf: false, emitEvent: false }
              );
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Miembro',
                detail: data.responseDto.message,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Miembro.',
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
      this.roleModule.createdUserId = this.userLogin.id;
      this.transactionService
        .save(environment.adminAPI, this.constantService.ROLE_MODULE_URL, this.roleModule)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.roleModuleForm.reset(
                {
                  roleModuleName: null,
                  email: null,
                  password: null,
                  repeatPassword: null,
                },
                { onlySelf: false, emitEvent: false }
              );
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Usuario',
                detail: data.responseDto.message,
              });
              this.getPaginationAndFilter();
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
    this.hideDialog();
    this.loading = false;
    this.loading = false;
  }

  deleteSelectedRoleModules() {
    if (this.selectedRoleModules || this.selectedRoleModules.length) {
      this.confirmationService.confirm({
        message:
          '¿Está seguro de que desea inactivar los seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedRoleModules.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.adminAPI, this.constantService.ROLE_MODULE_URL + '/' + this.userLogin.id, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Usuario',
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Usuario',
                    detail: data.responseDto.message,
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Usuario',
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.selectedRoleModules = null;
        },
      });
    }
  }

  deleteRoleModule(roleModule: RoleModule) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea inactivar ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(roleModule.id);
        this.transactionService
          .delete(environment.adminAPI, this.constantService.ROLE_MODULE_URL + '/' + this.userLogin.id, ids)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Usuario',
                  detail: data.responseDto.message,
                  life: 8000,
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Usuario',
                  detail: data.responseDto.message,
                  life: 8000,
                });
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Usuario',
                detail: 'Por favor, intente más tarde.',
              });
            }
          );
      },
    });
  }
}
