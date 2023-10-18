import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AzureBlobStorageService } from '../../../services/azure-blob-storage.service';
import { TransactionService } from '../../../services/transaction.service';
import { environment, SAS } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { FileInResume } from '../../../model/file-in-resume';
import { AuthService } from '../../../services/auth.service';
import { User } from '../../../model/user';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { FileError } from '../../../model/file-error';
import { SearchUpload } from '../../../model/search-upload';
import { Company } from '../../../model/company';
import { CompanyService } from '../../../enumeration/company-service';
// import officeProp from 'officeprops';

@Component({
  selector: 'app-upload-file',
  templateUrl: './upload-file.component.html',
  styleUrls: ['./upload-file.component.css']
})

export class UploadFileComponent implements OnInit {
  uploadForm: FormGroup;
  submitted: boolean;
  isUploadFile: boolean;
  attachment: string;
  attachmentForm: FormGroup;
  attachmentName: string;
  attachmentData: string;
  fileSelected: File;
  picture: String[] = [];
  userCreated: User;
  pagination: Pagination;
  updateFileInResume: FileInResume;
  loading: boolean;
  saveFileInResume: FileInResume;
  errorUploadDialog: boolean;
  searchUpload: SearchUpload[];
  successUploadDialog: boolean;
  overwriteDialog: boolean;
  validSelectedFile: boolean;
  validFileBack: boolean;
  companyId: Number;

  constructor(private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private confirmationService: ConfirmationService,
    private blobService: AzureBlobStorageService,
    private constantService: ConstantService,
    private authService: AuthService,
    private companyService: CompanyService
  ) {
    this.userCreated = this.authService.currentUserValue;

    this.uploadForm = this.fb.group({
      prefix: ['', [
        Validators.required,
        //Validators.maxLength(3),
        Validators.minLength(3),
        Validators.pattern(/^\d+$/)
      ]],
      docNum: ['', [
        Validators.required,
        Validators.maxLength(8),
        Validators.minLength(8)
      ]],
      company: ['', Validators.required]
    });

    this.attachmentForm = this.fb.group({
      attachment: new FormControl({ value: ("").toString() }),
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 0;
    this.isUploadFile = false;
    this.submitted = false;
    this.updateFileInResume = new FileInResume();
    this.loading = false;
    this.saveFileInResume = new FileInResume();
    this.errorUploadDialog = false;
    this.successUploadDialog = false;
    this.overwriteDialog = false;
    this.validSelectedFile = false;
    this.validFileBack = null;
    // this.officeProp = new officeProp();
    // this.reloadImage();
    this.companyId = 1;
  }

  get uf() {
    return this.uploadForm.controls;
  }

  validateAwb() {
    if (this.uploadForm.invalid) {
      this.submitted = true;
      return true;
    }
    let ultimoDigito = Number.parseInt(this.uf.docNum.value.slice(7, 8));
    let guia7 = Number.parseFloat(this.uf.docNum.value.slice(0, 7));
    let guiaDiv = guia7 / 7;
    let resultRest = guiaDiv - Math.trunc(guiaDiv);
    let resultMult = resultRest * 7;
    if (ultimoDigito == Math.round(resultMult))
      this.isUploadFile = true;
    else
      this.confirmationService.confirm({
        message: this.translateService.instant('module.CBP.uploadFile.validation.digVerificationValidation', "moduleName"),
        header: this.translateService.instant('module.CBP.moduleName', "moduleName"),
        icon: 'pi pi-exclamation-triangle'
      });
  }

  selectFile(event) {
    this.attachmentName = "";
    this.attachmentData = "";
    this.validSelectedFile = false;

    let pre;
    this.attachmentName = event.target.files[0].name.toString();
    this.fileSelected = event.target.files[0];
    let fileNamed = this.attachmentName.split('.');

    if (fileNamed[0] != `${this.uf.prefix.value}${this.uf.docNum.value}`) {
      this.messageService.add({
        severity: 'warn',
        summary: 'CBP',
        detail: this.translateService.instant('module.CBP.uploadFile.validation.sameNameValidation', "moduleName"),
        life: 16000
      });
      return;
    }

    this.fileSelected = this.removeData(event.target.files);
    this.validSelectedFile = this.fileSelected.size > 20971520;

    const reader = new FileReader();
    reader.readAsDataURL(event.target.files[0]);

    reader.onload = () => {
      this.validate(reader.result);
      // pre = reader.result;
    };
  }

  validUpload() {
    let filter = new FilterQuery();
    let fileInResumeDto = new FileInResume();
    fileInResumeDto.createUserId = this.userCreated.id;
    fileInResumeDto.fileName = this.attachmentName;
    fileInResumeDto.mawbPrefix = Number(this.uf.prefix.value);
    fileInResumeDto.mawbDocumentNumber = Number(this.uf.docNum.value);
    fileInResumeDto.active = true;
    filter = {
      filterDto: fileInResumeDto,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.CBPAPI, this.constantService.FILE_IN_RESUME_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          if (data.businessDto.length > 0) {
            this.updateFileInResume = data.businessDto[0];
            this.loading = false;
            this.overwriteDialog = true;
            // this.overwrite();
          }
          else {
            this.loading = true;
            this.saveBD();
          }
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

  handleFile(event) {
    var binaryString = event.target.result;
    this.attachmentData = btoa(binaryString);

  }

  imageSelected() {
    this.blobService.uploadData(SAS.tokenIn, SAS.containerNameIn, this.fileSelected, this.fileSelected.name, (status) => {
      if (status == 201) {
        setTimeout(() => {
          this.completeFileUpload();
        }, 5000);
      }

    });
  }

  overwrite() {
    this.updateFileInResume.active = false;
    this.loading = true;
    this.overwriteDialog = false;
    this.transactionService
      .update(environment.CBPAPI, this.constantService.FILE_IN_RESUME_URL, this.updateFileInResume)
      .subscribe(
        (data) => {
          if (
            data.responseDto.response === this.constantService.RESPONSE_OK
          ) {
            this.saveBD();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'CBP',
              detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Aerolíneas',
            detail: 'Por favor, intente más tarde.',
          });
        }
      );
  }


  saveBD() {
    let dto = new FileInResume();
    dto.mawbPrefix = Number(this.uf.prefix.value);
    dto.mawbDocumentNumber = Number(this.uf.docNum.value);
    dto.fileResumeStatusId = this.constantService.FileResumeStatusRecibido;
    dto.fileName = this.fileSelected.name;
    dto.createUserId = this.userCreated.id;
    dto.active = true;
    dto.companyId = this.companyId;

    this.transactionService.save(environment.CBPAPI, this.constantService.FILE_IN_RESUME_URL, dto).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.saveFileInResume = data.businessDto[0];
          this.imageSelected();
        }
        else {
          this.loading = false;
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

  completeFileUpload() {
    let filter = new FilterQuery();
    this.saveFileInResume.fileResumeStatusId = 0;
    filter = {
      filterDto: this.saveFileInResume,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.CBPAPI, this.constantService.FILE_IN_RESUME_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {

          this.loading = false;

          if (data.businessDto[0].fileResumeStatusId == this.constantService.FileResumeStatusExitoso) {
            this.successUploadDialog = true;
            // this.confirmationService.confirm({
            //   message: this.translateService.instant('module.CBP.uploadFile.successUpload', "moduleName"),
            //   icon: 'pi pi-exclamation-triangle'
            // });
          }
          else if (data.businessDto[0].fileResumeStatusId == this.constantService.FileResumeStatusError) {
            this.getFileError();
          }
          else {
            this.loading = true;
            setTimeout(() => {
              this.completeFileUpload();
            }, 5000);
          }
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
    fileOutResumeDto.fileInResume.id = this.saveFileInResume.id;
    fileOutResumeDto.fileInResume.createUserId = this.userCreated.id;



    filter = {
      filterDto: fileOutResumeDto,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.CBPAPI, this.constantService.FILE_ERROR_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.errorUploadDialog = true;
          this.searchUpload = data.businessDto.map(x => {
            let searchMap = new SearchUpload();
            searchMap.fileName = x.fileInResume.fileName;
            searchMap.date = x.createDate;
            searchMap.fileType = x.description;
            searchMap.userName = x.fileInResume.userCreate.email;
            searchMap.line = x.line;
            return searchMap;
          });
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


  removeData(files): File {


    let newFile: File[] = [];
    newFile[0] = files[0];

    const officeprops = require('OfficeProps');
    officeprops.removeData(files[0])
      .then(function (officeFile) {
        officeFile.name = files[0].name;
        officeFile.lastModifiedDate = files[0].lastModifiedDate;
        officeFile.webkitRelativePath = files[0].webkitRelativePath;
        newFile[0] = officeFile;
      });
    return newFile[0];
  }


  validate(pre) {
    let base = pre.split(',');
    let fileValidation = {
      fileBase64: base[1]
    }

    this.transactionService.save(environment.CBPAPI, `${this.constantService.FILE_VALIDATION_URL}/Validation`, fileValidation).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK)
          this.validFileBack = true;
        else{
          this.validFileBack = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'CBP',
            detail: data.responseDto.message,
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

  /*
  receiveCompany(company: Company) {
    this.company = company;
  }

  getCompanysByName() {
    this.loading = true;
    this.transactionService.GetList(environment.CBPAPI, this.constantService.COMPANY_URL, '/' + this.companyService.aviancaAV).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.company = data.businessDto[0];
        }

        this.loading = false;
      },
      (error) => {
        console.log('Error: ' + error);
        this.loading = false;
      }
    );
  }
  */
}
