import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';
import { AutomaticAssignmentsUser } from '../../../model/automatic-assignments-user';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-automaticAssignmentsUser',
  templateUrl: './automatic-assignments-user.component.html',
  styleUrls: ['./automatic-assignments-user.component.css']
})

export class AutomaticAssignmentsUserComponent implements OnInit {
  automaticAssignmentsUserDialog: boolean;
  newAutomaticAssignmentsUser: boolean;
  submitted: boolean;
  loading: boolean;
  automaticAssignmentsUserForm: FormGroup;
  automaticAssignmentsUsers: AutomaticAssignmentsUser[];
  automaticAssignmentsUser: AutomaticAssignmentsUser;
  automaticAssignmentsUserFind: AutomaticAssignmentsUser;
  selectedAutomaticAssignmentsUsers: AutomaticAssignmentsUser[];
  userAsignment: User;
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
    private translateService: TranslateService
  ) {
    this.automaticAssignmentsUserForm = this.fb.group({
      userAsignment: ['', Validators.required],
      quotes: [false],
      bookings: [false],
      available: [false]
    });

    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.automaticAssignmentsUserFind = new AutomaticAssignmentsUser();
    this.automaticAssignmentsUserFind.user = new User();
  }

  get f() {
    return this.automaticAssignmentsUserForm.controls;
  }

  openNew() {
    this.automaticAssignmentsUser = new AutomaticAssignmentsUser();
    this.submitted = false;
    this.automaticAssignmentsUserDialog = true;
    this.userAsignment = null;
  }

  editAutomaticAssignmentsUser(automaticAssignmentsUser: AutomaticAssignmentsUser) {
    this.automaticAssignmentsUser = { ...automaticAssignmentsUser };
    this.userAsignment = this.automaticAssignmentsUser.user;
    this.newAutomaticAssignmentsUser = false;
    this.automaticAssignmentsUserDialog = true;
  }

  saveAutomaticAssignmentsUser() {
    this.submitted = true;
    this.loading = true;

    if (this.automaticAssignmentsUserForm.invalid) {
      this.loading = false;
      return;
    }

    this.automaticAssignmentsUser.createdUserId = this.user.id;
    this.automaticAssignmentsUser.userId = this.userAsignment.id;

    if (this.automaticAssignmentsUser.id) {
      this.transactionService
        .update(environment.adminAPI, this.constantService.AUTOMATIC_ASSIGNMENTS_USER_URL, this.automaticAssignmentsUser).subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.automaticAssignmentsUserForm.reset(
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
        .save(environment.adminAPI, this.constantService.AUTOMATIC_ASSIGNMENTS_USER_URL, this.automaticAssignmentsUser).subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.automaticAssignmentsUserForm.reset(
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
                summary: 'module.automaticAssignmentsUser.title',
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('module.automaticAssignmentsUser.title'),
                detail: this.translateService.instant(data.responseDto.message),
                life: 8000
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'module.automaticAssignmentsUser.',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    }
    this.hideDialog();
    this.loading = false;
  }

  hideDialog() {
    this.automaticAssignmentsUserDialog = false;
    this.submitted = false;
  }

  private getAutomaticAssignmentsUser() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.ROLE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.automaticAssignmentsUsers = data.businessDto;
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

  deleteSelectedAutomaticAssignmentsUsers() {
    if (this.selectedAutomaticAssignmentsUsers || this.selectedAutomaticAssignmentsUsers.length) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea inactivar los automaticAssignmentsUsers seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedAutomaticAssignmentsUsers.forEach(function (value) {
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
          this.selectedAutomaticAssignmentsUsers = null;
        },
      });
    }
  }

  deleteAutomaticAssignmentsUser(automaticAssignmentsUser: AutomaticAssignmentsUser) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea inactivar el rol ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(automaticAssignmentsUser.id);

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
      filterDto: this.automaticAssignmentsUserFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.AUTOMATIC_ASSIGNMENTS_USER_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.automaticAssignmentsUsers = data.businessDto;
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

  loadAutomaticAssignmentsUsers(event: LazyLoadEvent) {
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
