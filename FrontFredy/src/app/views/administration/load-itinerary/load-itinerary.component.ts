import { Message } from '@angular/compiler/src/i18n/i18n_ast';
import { ViewChild } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { FileUpload } from "primeng/fileupload";
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-load-itinerary',
  templateUrl: './load-itinerary.component.html',
  styleUrls: ['./load-itinerary.component.css']
})
export class LoadItineraryComponent implements OnInit {
  validations: any = { "status": true };
  loading: boolean;
  severity: string;
  msgs: Message[];
  @ViewChild(FileUpload) fileUploader: FileUpload;

  constructor(
    private messageService: MessageService, 
    private transactionService: TransactionService, 
    private constantService: ConstantService,
    private translateService: TranslateService
  ) { }

  ngOnInit(): void {
  }

  uploader(event) {
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  handleReaderLoaded(e) {
    let str = e.target.result;
    str = str.split("base64,")[1];
    this.transactionService
      .save(environment.adminAPI, this.constantService.LOAD_ITINERARY_URL, { file: str })
    .subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.fileUploader.clear();
          this.messageService.add({
            severity: 'success',
            summary: this.translateService.instant('module.importItinerary.moduleName', "moduleName"),
            detail: data.responseDto.message,
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.importItinerary.moduleName', "moduleName"),
            detail: data.responseDto.message + ', ' + this.translateService.instant('module.alerts.errorApi', "errorApi"),
            life: 8000,
          });
        }
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.importItinerary.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
        });
      }
    );
  }
}
