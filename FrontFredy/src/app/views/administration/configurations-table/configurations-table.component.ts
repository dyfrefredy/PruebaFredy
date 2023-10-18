import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { MessageService, ConfirmationService } from 'primeng/api';
import { LazyLoadEvent } from 'primeng/api/lazyloadevent';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { ConfigurationsTable } from '../../../model/configurations-table';
import { FilterQuery } from '../../../model/filter-query';
import { OrderTable } from '../../../model/order-table';
import { Pagination } from '../../../model/pagination';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-configurations-table',
  templateUrl: './configurations-table.component.html',
  styleUrls: ['./configurations-table.component.css'],
})
export class ConfigurationsTableComponent implements OnInit {
  configurationsDialog: boolean;
  configurations: ConfigurationsTable[];
  configuration: ConfigurationsTable;
  selectedConfigurations: ConfigurationsTable;
  configurationFilter: ConfigurationsTable;
  configurationTableForm: FormGroup;

  submitted: boolean;
  loading: boolean;

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
    this.configurationTableForm = this.fb.group({
      configurationFilter: ['', Validators.required],
      configuredValue: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.configurationFilter = new ConfigurationsTable();
    this.pagination = new Pagination();
  }

  openNew() {
    this.configuration = new ConfigurationsTable();
    this.submitted = false;
    this.configurationsDialog = true;
  }

  hideDialog() {
    this.configurationsDialog = false;
    this.submitted = false;
  }

  saveConfigurations(configuration: ConfigurationsTable) {
    this.submitted = true;
    this.loading = true;
    if (this.configurationTableForm.invalid) {
      this.loading = false;
      return;
    }

    if (configuration.configurationFilter.trim()) {
      if (this.configuration != null) {
        this.transactionService
          .update(environment.adminAPI, this.constantService.CONFIG_URL, configuration)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.submitted = false;
                this.messageService.add({
                  severity: 'success',
                  summary: 'Configuración',
                  detail: data.responseDto.message,
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Configuración',
                  detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                  life: 8000,
                });
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Configuración',
                detail: 'Por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          );
      } else {
        this.transactionService
          .save(environment.adminAPI, this.constantService.CONFIG_URL, configuration)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Configuración',
                  detail: data.responseDto.message,
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Configuración',
                  detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                  life: 8000,
                });
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Configuración',
                detail: 'Por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          );
      }
    }
    this.hideDialog();
    this.loading = false;
  }

  editConfig(configuration: ConfigurationsTable) {
    this.configuration = { ...configuration };
    this.configurationsDialog = true;
  }

  private getConfiguration() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.CONFIG_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.configurations = data.businessDto;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Configuración',
            detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Configuración',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();
    //let this.airline = { ...airline };
    filter = {
      filterDto: this.configurationFilter,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.CONFIG_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.configurations = data.businessDto;
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

  loadConfigurationTable(event: LazyLoadEvent) {
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
