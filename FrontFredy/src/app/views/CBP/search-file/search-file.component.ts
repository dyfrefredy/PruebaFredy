import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { format } from 'path';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { environment, SAS } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { FileError } from '../../../model/file-error';
import { FileInResume } from '../../../model/file-in-resume';
import { FileOutResume } from '../../../model/file-out-resume';
import { FilterQuery } from '../../../model/filter-query';
import { OrderTable } from '../../../model/order-table';
import { Pagination } from '../../../model/pagination';
import { SearchUpload } from '../../../model/search-upload';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { AzureBlobStorageService } from '../../../services/azure-blob-storage.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-search-file',
  templateUrl: './search-file.component.html',
  styleUrls: ['./search-file.component.css']
})
export class SearchFileComponent implements OnInit {

  fileType: Number;
  dateStart: Date;
  dateEnd: Date;
  searchUpload: SearchUpload[];
  userCreated: User;
  pagination: Pagination;
  minDate: Date;
  currentDate: Date;
  searchForm: FormGroup;
  submitted: boolean;
  totalRecords: Number;
  maxDate: Date;

  constructor(
    private transactionService: TransactionService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private blobService: AzureBlobStorageService,
    private constantService: ConstantService,
    private authService: AuthService,
    private fb: FormBuilder,
  ) {
    this.userCreated = this.authService.currentUserValue;

    this.searchForm = this.fb.group({
      fileType: ['', Validators.required],
      dateStart: ['', Validators.required],
      dateEnd: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 0;
    //this.minDate = moment().add(-90, 'days').toDate();
    this.currentDate = new Date(Date.now());
    this.minDate = new Date(this.currentDate.setMonth(this.currentDate.getMonth() - 3));
    //this.dateEnd = new Date();
  }

  get f() {
    return this.searchForm.controls;
  }

  search() {
    this.submitted = true;

    if (this.searchForm.invalid) {
      return;
    }

    if (this.fileType == this.constantService.FileIn)
      this.getFileInResume();

    if (this.fileType == this.constantService.FileOut)
      this.getFileOutResume();

    if (this.fileType == this.constantService.FileLog)
      this.getFileError();
  }

  getFileInResume() {
    let filter = new FilterQuery();
    let fileInResumeDto = new FileInResume();
    fileInResumeDto.createUserId = this.userCreated.id;
    fileInResumeDto.active = true;
    fileInResumeDto.rolId = this.userCreated.roleId;
    fileInResumeDto.createDateStart = this.dateStart;
    fileInResumeDto.createDateEnd = this.dateEnd;
    
    filter = {
      filterDto: fileInResumeDto,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.CBPAPI, this.constantService.FILE_IN_RESUME_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.searchUpload = data.businessDto.map(x => {
            let searchMap = new SearchUpload();
            searchMap.fileName = x.fileName;
            searchMap.date = x.createDate;
            searchMap.fileType = x.fileResumeStatus.description;
            searchMap.userName = x.userCreate.email;
            searchMap.mAWB = `${x.mawbPrefix}-${x.mawbDocumentNumber}`;
            this.blobService.existBlob(SAS.tokenIn, SAS.containerNameIn, x.fileName).then(j => { searchMap.isDownload = j });
            return searchMap;
          });

          this.totalRecords = data.totalRecords;
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant(data.responseDto.message, "moduleName"),
            detail: this.translateService.instant(data.responseDto.message, "moduleName"),
            life: 16000
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Por favor, intente nuevamente.',
          detail: 'Por favor, intente más tarde.' + '. ' +
            this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
          life: 16000
        });
      }
    );
  }


  getFileOutResume() {
    let filter = new FilterQuery();
    let fileOutResumeDto = new FileOutResume();
    fileOutResumeDto.fileInResume = new FileInResume();
    fileOutResumeDto.fileInResume.createUserId = this.userCreated.id;
    fileOutResumeDto.fileInResume.active = true;
    fileOutResumeDto.rolId = this.userCreated.roleId;
    fileOutResumeDto.createDateStart = this.dateStart;
    fileOutResumeDto.createDateEnd = this.dateEnd;

    filter = {
      filterDto: fileOutResumeDto,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.CBPAPI, this.constantService.FILE_OUT_RESUME_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.searchUpload = data.businessDto.map(x => {
            let searchMap = new SearchUpload();
            searchMap.fileName = x.fileName;
            searchMap.date = x.createDate;
            searchMap.fileType = x.fileInResume.fileResumeStatus.description;
            searchMap.userName = x.fileInResume.userCreate.email;
            searchMap.mAWB = `${x.fileInResume.mawbPrefix}-${x.fileInResume.mawbDocumentNumber}`;
            this.blobService.existBlob(SAS.tokenOut, SAS.containerNameOut, x.fileName).then(j => { searchMap.isDownload = j });
            return searchMap;
          });

          this.totalRecords = data.totalRecords;
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant(data.responseDto.message, "moduleName"),
            detail: this.translateService.instant(data.responseDto.message, "moduleName"),
            life: 16000
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Por favor, intente nuevamente.',
          detail: 'Por favor, intente más tarde.' + '. ' +
            this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
          life: 16000
        });
      }
    );
  }

  getFileError() {
    let filter = new FilterQuery();
    let fileOutResumeDto = new FileError();
    fileOutResumeDto.fileInResume = new FileInResume();
    fileOutResumeDto.fileInResume.createUserId = this.userCreated.id;
    fileOutResumeDto.fileInResume.active = true;
    fileOutResumeDto.rolId = this.userCreated.roleId;
    fileOutResumeDto.createDateStart = this.dateStart;
    fileOutResumeDto.createDateEnd = this.dateEnd;

    filter = {
      filterDto: fileOutResumeDto,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.CBPAPI, this.constantService.FILE_ERROR_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.searchUpload = data.businessDto.map(x => {
            let searchMap = new SearchUpload();
            searchMap.fileName = x.fileInResume.fileName;
            searchMap.date = x.createDate;
            searchMap.fileType = x.description;
            searchMap.userName = x.fileInResume.userCreate.email;
            searchMap.line = x.line;
            searchMap.mAWB = `${x.fileInResume.mawbPrefix}-${x.fileInResume.mawbDocumentNumber}`;
            return searchMap;
          });

          this.totalRecords = data.totalRecords;
        }
        else {
          this.messageService.add({
            severity: 'error',
            summary: this.translateService.instant(data.responseDto.message, "moduleName"),
            detail: this.translateService.instant(data.responseDto.message, "moduleName"),
            life: 16000
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Por favor, intente nuevamente.',
          detail: 'Por favor, intente más tarde.' + '. ' +
            this.translateService.instant("module.directClaims.serviceMessages.error", "moduleName"),
          life: 16000
        });
      }
    );
  }

  download(item) {
    let containerName = '';
    let token = '';
    if (this.fileType == this.constantService.FileIn || this.fileType == this.constantService.FileLog) {
      containerName = SAS.containerNameIn;
      token = SAS.tokenIn;
    }

    if (this.fileType == this.constantService.FileOut) {
      token = SAS.tokenOut;
      containerName = SAS.containerNameOut;
    }

    this.blobService.downloadData(token, containerName, item, blob => {
      let url = window.URL.createObjectURL(blob);
      window.open(url);
    });
  }

  loadQuotation(event: LazyLoadEvent) {
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

    if (!this.searchForm.invalid) {
      this.search();
    }
  }

  addMonth() {
    let dateTemp = new Date();
    dateTemp = new Date(this.dateStart);
    //this.dateEnd = new Date(this.dateEnd.setMonth(this.dateEnd.getMonth() + 1));
    this.maxDate = new Date(dateTemp.setMonth(this.dateStart.getMonth() + 1));
  }
}
