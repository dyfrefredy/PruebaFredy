import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { Message } from '../../../model/message';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.component.html',
  styleUrls: ['./messages.component.scss']
})
export class MessagesComponent implements OnInit {
  messageDialog: boolean;
  newMessage: boolean;
  submitted: boolean;
  loading: boolean;
  messageForm: FormGroup;
  messages: Message[];
  message: Message;
  messageFind: Message;
  selectedMessages: Message[];

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;
  labelYes: string;

  constructor(private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) {

    this.messageForm = this.fb.group({
      id: [''],
      languageId: ['', Validators.required],
      attached: [false],
      affair: ['', Validators.required],
      messageText: ['', Validators.required],
      notificationTypeId: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.messageFind = new Message();
    this.labelYes= this.translateService.instant('module.messages.yes', "moduleName");
  }

  get f() {
    return this.messageForm.controls;
  }

  loadMessages(event: LazyLoadEvent) {
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

  hideDialog() {
    this.messageDialog = false;
    this.submitted = false;
  }

  getPaginationAndFilter() {

    let filter = new FilterQuery();

    filter = {
      filterDto: this.messageFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.claimsAPI, this.constantService.MESSAGES_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messages = data.businessDto;
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
    this.message = new Message();
    this.submitted = false;
    this.messageDialog = true;
  }

  editMessage(message: Message) {
    this.message = { ...message };
    this.messageDialog = true;
    this.newMessage = false;
  }

  deleteMessage(message: Message) {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
      header:  this.translateService.instant('module.messages.titleConfirm', "moduleName"),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(message.id);

        this.transactionService
          .delete(environment.claimsAPI, this.constantService.MESSAGES_URL, ids)
          .subscribe((data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                detail: data.responseDto.message,
                life: 3000,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
            (error) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                detail: 'Por favor, intente más tarde.',
              });
            }
          );
      },
    });
  }

  deleteSelectedMessages() {
    if (this.selectedMessages || this.selectedMessages.length) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea eliminar las estaciones seleccionadas?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedMessages.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.claimsAPI, this.constantService.MESSAGES_URL, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                    detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.selectedMessages = null;
        },
      });
    }
  }

  saveMessage(message: Message) {

    this.submitted = true;
    this.loading = true;

    if (this.messageForm.invalid) {
      this.loading = false;
      return;
    }

    if (this.message.attached == null) {
      this.message.attached = false;
    }

    if (this.message.id) {
      this.transactionService
        .update(environment.claimsAPI, this.constantService.MESSAGES_URL, this.message)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageForm.reset(
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
                summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                detail:
                  data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    } else {
      this.transactionService
        .save(environment.claimsAPI, this.constantService.MESSAGES_URL, message)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageForm.reset(
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
                summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: this.translateService.instant('module.messages.titleConfirm', "moduleName"),
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    }
    this.hideDialog();
    this.loading = false;
  }
}
