import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { Claim } from '../../../model/claim';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { ReportClaim } from '../../../model/report-claim.model';
import { StorageService } from '../../../services/storage.service';
import { TransactionService } from '../../../services/transaction.service';
import { Workbook } from 'exceljs';
import moment from 'moment';
import * as fs from 'file-saver';

@Component({
  selector: 'app-list-assignments',
  templateUrl: './list-assignments.component.html',
  styleUrls: ['./list-assignments.component.scss']
})
export class ListAssignmentsComponent implements OnInit {

  @Input() options: Array<{ label: string, value: boolean }>;
  @Input() selectionLabel: string;
  documentsForm: FormGroup;
  state: any[];
  selection: any;

  claim: Claim;
  reportClaim: ReportClaim;
  claimSummaries: Claim[];

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;
  language: string;
  storageService1: any;

  descriptionReason: string;

  submitted: boolean;
  loading: boolean;

  constructor(private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
    private storageService: StorageService) {

    this.documentsForm = this.fb.group({
      formalInitDate: ['', null],
      formalEndDate: ['', null],
      createdInitDate: ['', Validators.required],
      createdEndDate: ['', Validators.required],
      claimStatus: ['',],
      guideNumber: new FormControl('', []),
      reasonCodeId: [''],
    });
  }

  ngOnInit(): void {
    this.language = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang
  }


  get f() {
    return this.documentsForm.controls;
  }

  getClaimAssignment() {
    this.submitted = true;

    if (this.documentsForm.invalid)
      return;
    else
      this.submitted = false;

    var str = this.f.guideNumber.value.toString();
    var prefix = str != undefined ? str.substring(0, 3) : null;
    var guide = str != undefined ? str.substring(3) : null;

    this.reportClaim = new ReportClaim();
    this.reportClaim.createdEndDate = new Date(this.f.createdEndDate.value.toString());
    this.reportClaim.createdInitDate = new Date(this.f.createdInitDate.value.toString());
    this.reportClaim.formalEndDate = new Date(this.f.formalEndDate.value.toString());
    this.reportClaim.formalInitDate = new Date(this.f.formalInitDate.value.toString());
    this.reportClaim.masterDocumentNumber = Number(guide);
    this.reportClaim.claimStatus = Number(this.f.claimStatus.value);
    this.reportClaim.shipmentPrefix = Number(prefix);
    this.reportClaim.claimReasonCode = this.f.reasonCodeId.value;

    let filter = new FilterQuery();

    filter = {
      filterDto: this.reportClaim,
      paginationDto: null
    };

    this.transactionService.getReport(environment.claimsAPI, this.constantService.REPORT_CLAIM_URL, this.constantService.REPORT_CLAIM_ASSINGMENT_URL ,filter
    ).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.claimSummaries = data.businessDto;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Claims',
            detail: this.translateService.instant(data.responseDto.message, "moduleName"),
            life: 8000,
          });
          this.claimSummaries = data.businessDto;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Claim',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  exportExcel() {
    if (this.claimSummaries == undefined || this.claimSummaries?.length < 1)
      return;

    this.loading = true;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report');
    const title = 'Booking';
    const header = [
      this.translateService.instant('module.directClaims.shipmentPrefix', "shipmentPrefix"),
      this.translateService.instant('module.directClaims.masterDocumentNumber', "masterDocumentNumber"),
      this.translateService.instant('module.directClaims.AssignTo', "AssignTo"),
      this.translateService.instant('module.directClaims.claimAmount', "claimAmount"),
      this.translateService.instant('module.directClaims.createdDate', "createdDate"),
      this.translateService.instant('module.directClaims.preeliminarDate', "preeliminarDate"),
      this.translateService.instant('module.directClaims.formalDate', "formalDate"),
      this.translateService.instant('module.directClaims.claimStatus', "claimStatus")
    ]

    const principalLeg = [];

    this.claimSummaries.forEach(i => {
      var status;

      if (i.preeliminarDate == null && i.formalDate == null)
        status = this.translateService.instant('module.directClaims.claimStatusType.extemporaneous', "extemporaneous");
      if (i.preeliminarDate != null && i.formalDate == null)
        status = this.translateService.instant('module.directClaims.claimStatusType.preliminary', "preliminary");
      if (i.formalDate != null)
        status = this.translateService.instant('module.directClaims.claimStatusType.formal', "formal");

      principalLeg.push([
        i.shipmentPrefix,
        i.masterDocumentNumber,
        i.userFirstName + " " + i.userLastName,
        i.claimAmount,
        moment(i.createdDate).format("YYYY/MM/DD HH:mm"),
        i.preeliminarDate ? moment(i.preeliminarDate).format("YYYY/MM/DD HH:mm") : "",
        i.formalDate ? moment(i.formalDate).format("YYYY/MM/DD HH:mm") : "",
        status
      ]);
    });

    const data = principalLeg;
    worksheet.addRow([]);
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' },
        bgColor: { argb: 'FFFF0000' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    data.forEach(d => {
      const row = worksheet.addRow(d);
    });

    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Listado.xlsx');
    });

    this.loading = false;
  }
}
