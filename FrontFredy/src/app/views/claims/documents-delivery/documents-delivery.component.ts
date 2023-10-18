import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { Claim } from '../../../model/claim';
import { FilterQuery } from '../../../model/filter-query';
import { LoadedDocument } from '../../../model/loaded-document';
import { Pagination } from '../../../model/pagination';
import { ReportClaim } from '../../../model/report-claim.model';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-documents-delivery',
  templateUrl: './documents-delivery.component.html',
  styleUrls: ['./documents-delivery.component.scss']
})
export class DocumentsDeliveryComponent implements OnInit {

  @Input() options: Array<{ label: string, value: boolean }>;
  @Input() selectionLabel: string;
  documentsForm: FormGroup;
  state: any[];
  selection: any;

  loading: boolean;
  submitted: boolean;
  claim: Claim;
  reportClaim: ReportClaim;
  claimSummaries: Claim[];

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  loadedDocument: LoadedDocument;


  constructor(private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService) {

    this.documentsForm = this.fb.group({
      formalInitDate: new FormControl('', [
        Validators.required]),
      createdInitDate: new FormControl('', [
        Validators.required]),
      formalEndDate: new FormControl('', [
        Validators.required]),
      createdEndDate: new FormControl('', [
        Validators.required]),
      delivered: [''],
      guideNumber: new FormControl('', [
        Validators.required]),

    });




    this.state = [
      { label: 'Entregado', value: true },
      { label: 'Pendiente', value: false }
    ];

  }

  ngOnInit(): void {
    this.claimSummaries = [];

    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;

    this.selectionLabel = this.translateService.instant('module.directClaims.stateLoad', "moduleName");

    this.options = new Array();
    this.options.push({ label: this.selectionLabel, value: null });
    this.options.push({ label: 'Entregado', value: true });
    this.options.push({ label: 'Pendiente', value: false });


  }


  get f() {
    return this.documentsForm.controls;
  }


  getAwbDocuments() {

    var str = this.f.guideNumber.value.toString();
    var prefix = str != undefined ? str.substring(0, 3) : null;
    var guide = str != undefined ? str.substring(3) : null;

    this.reportClaim = new ReportClaim();
    this.reportClaim.createdEndDate = new Date(this.f.createdEndDate.value.toString());
    this.reportClaim.createdInitDate = new Date(this.f.createdInitDate.value.toString());
    this.reportClaim.formalEndDate = new Date(this.f.formalEndDate.value.toString());
    this.reportClaim.formalInitDate = new Date(this.f.formalInitDate.value.toString());
    this.reportClaim.masterDocumentNumber = Number(guide);
    this.reportClaim.delivered = this.f.delivered.value == '' ? false : this.f.delivered.value;
    this.reportClaim.shipmentPrefix = Number(prefix);
    let filter = new FilterQuery();

    filter = {
      filterDto: this.reportClaim,
      paginationDto: null
    };

    this.transactionService.getReport(environment.claimsAPI, this.constantService.REPORT_CLAIM_URL, this.constantService.FILTER_REPORT_URL, filter
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
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Claim',
          detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
        });
      }
    );
  }



  updateLoadedDocs(load: Claim) {
    this.loading = true;

    this.loadedDocument = new LoadedDocument();


    this.loadedDocument.Id = Number(load.idLoadedDoc);
    this.loadedDocument.IdClaim = Number(load.id);
    this.loadedDocument.Loaded = load.isLoaded;
    this.loadedDocument.LoadedDate = load.loadedDate;




    if (load.idLoadedDoc != null && load.idLoadedDoc != 0) {
      this.transactionService
        .update(environment.claimsAPI, this.constantService.LOADED_DOCUMENT, this.loadedDocument)
        .subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.submitted = false;
              this.messageService.add({
                severity: 'success',
                summary: this.translateService.instant('module.directClaims.documentLoad', "moduleName"),
              });

            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail:
                  this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
                life: 8000,
              });
            }
          },
          (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Claims.',
              detail: this.translateService.instant('module.directClaims.serviceMessages.error', "moduleName"),
              life: 8000,
            });
          }
        );
    }

  }





}
