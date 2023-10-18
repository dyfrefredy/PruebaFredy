import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { Escalation } from '../../../model/escalation';
import { ImportEscalation } from '../../../model/import-escalation';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-escalation',
  templateUrl: './escalation.component.html',
  styleUrls: ['./escalation.component.scss']
})
export class EscalationComponent implements OnInit {

  escalationDialog: boolean;
  importDialog: boolean;
  newEscalation: boolean;
  submitted: boolean;
  loading: boolean;
  importForm: FormGroup;
  escalationForm: FormGroup;
  escalations: Escalation[];
  escalation: Escalation;
  importEscalation: ImportEscalation;
  escalationFind: Escalation;
  selectedEscalations: Escalation[];

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;
  stationPrincipal: boolean = false;

  constructor(private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService) {

    this.escalationForm = this.fb.group({
      id: [''],
      stationId: ['', Validators.required],
      languageId: ['', Validators.required],
      notificationEmail: new FormControl('', [
        Validators.required,
        Validators.email]),
      escalationLevelId: ['', Validators.required]
    });
    this.importForm = this.fb.group({
      delete: [false],
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.escalationFind = new Escalation();
  }

  get fg() {
    return this.escalationForm.controls;
  }

  loadEscalations(event: LazyLoadEvent) {
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
    this.escalationDialog = false;
    this.submitted = false;
    this.escalationForm.reset();
  }

  hideImportDialog() {
    this.importDialog = false;
    this.submitted = false;
    this.importForm.reset();
  }

  getPaginationAndFilter() {

    let filter = new FilterQuery();

    filter = {
      filterDto: this.escalationFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.claimsAPI, this.constantService.ESCALATION_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.escalations = data.businessDto;
          this.totalRecords = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Notificación',
            detail: data.responseDto.message,
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Notificación',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );

  }

  openNew() {
    this.escalation = new Escalation();
    this.submitted = false;
    this.escalationDialog = true;
  }

  openImport() {
    this.importEscalation = new ImportEscalation();
    this.importDialog = true;
  }

  editEscalation(escalation: Escalation) {
    this.escalation = { ...escalation };
    this.escalationDialog = true;
    this.newEscalation = false;
  }

  deleteEscalation(escalation: Escalation) {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.escalation.confirmation', "moduleName"),
      header: this.translateService.instant('module.escalation.confirmationTitle', "moduleName"),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(escalation.id);

        this.transactionService
          .delete(environment.claimsAPI, this.constantService.ESCALATION_URL, ids)
          .subscribe((data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.messageService.add({
                severity: 'success',
                summary: 'Notificación',
                detail: data.responseDto.message,
                life: 3000,
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Notificación',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
            (error) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Notificación',
                detail: 'Por favor, intente más tarde.',
              });
            }
          );
      },
    });
  }

  deleteSelectedEscalations() {
    if (this.selectedEscalations || this.selectedEscalations.length) {
      this.confirmationService.confirm({
        message: '¿Está seguro de que desea eliminar las estaciones seleccionadas?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedEscalations.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.claimsAPI, this.constantService.ESCALATION_URL, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Notificación',
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Notificación',
                    detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Notificación',
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.selectedEscalations = null;
        },
      });
    }
  }

  saveEscalation(escalation: Escalation) {

    this.submitted = true;
    this.loading = true;

    if (this.escalationForm.invalid) {
      this.loading = false;
      return;
    }

    if (this.escalation.id) {
      this.transactionService
        .update(environment.claimsAPI, this.constantService.ESCALATION_URL, this.escalation)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.escalationForm.reset();
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Notificación',
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'warn',
                summary: 'Notificación',
                detail:
                  data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Notificación',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    } else {
      this.transactionService
        .save(environment.claimsAPI, this.constantService.ESCALATION_URL, escalation)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.escalationForm.reset();
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Notificación',
                detail: data.responseDto.message
              });
              this.getPaginationAndFilter();
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Notificación.',
                detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Notificación.',
              detail: 'Por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        );
    }
    this.hideDialog();
    this.loading = false;
  }

  uploader(event) {
    this.submitted = true;

    // stop here if airlineform is invalid
    if (this.importForm.invalid) {
      return;
    }
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  handleReaderLoaded(e) {
    let str = e.target.result;
    str = str.split("base64,")[1];
    this.importEscalation.file = str;
    this.transactionService
      .save(environment.claimsAPI, this.constantService.IMPORT_ESCALATION_URL, this.importEscalation)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.messageService.add({
              severity: 'success',
              summary: 'Notificación',
              detail: data.responseDto.message,
              life: 3000,
            });
            this.getPaginationAndFilter();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Notificación',
              detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Notificación',
            detail: 'Por favor, intente más tarde.',
          });
        }
      );
      this.hideImportDialog();
      this.loading = false;
  }

  exportEscalations(){
    this.transactionService.getAll(environment.claimsAPI, this.constantService.ESCALATION_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.downloadFile(data.businessDto, "Notificaciones");
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  downloadFile(data, filename = 'data') {
    let csvData = this.ConvertToCSV(data, ['escalationLevelDesc', 'notificationEmail', 'stationDesc', 'languageDesc']);
    //console.log(csvData)
    let blob = new Blob(['\ufeff' + csvData], { type: 'text/csv;charset=utf-8;' });
    let dwldLink = document.createElement("a");
    let url = URL.createObjectURL(blob);
    let isSafariBrowser = navigator.userAgent.indexOf('Safari') != -1 && navigator.userAgent.indexOf('Chrome') == -1;
    if (isSafariBrowser) {  //if Safari open in new window to save file with random filename.
      dwldLink.setAttribute("target", "_blank");
    }
    dwldLink.setAttribute("href", url);
    dwldLink.setAttribute("download", filename + "_" + Date.now() + ".csv");
    dwldLink.style.visibility = "hidden";
    document.body.appendChild(dwldLink);
    dwldLink.click();
    document.body.removeChild(dwldLink);
  }

  ConvertToCSV(objArray, headerList) {
    let array = typeof objArray != 'object' ? JSON.parse(objArray) : objArray;
    let str = '';
    let row = '';
    for (let index in headerList) {
      row += headerList[index] + ';';
    }
    row = row.slice(0, -1);
    str += row + '\r\n';
    for (let i = 0; i < array.length; i++) {
      let line = '';
      for (let index in headerList) {
        let head = headerList[index];
        line += ';' + array[i][head];
      }
      str += line.substring(1) + '\r\n';
    }
    return str;
  }
}
