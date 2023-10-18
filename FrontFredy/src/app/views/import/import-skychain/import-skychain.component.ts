import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message, MessageService } from 'primeng/api';
import { FileUpload } from 'primeng/fileupload';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { ImportSkychain } from '../../../model/import-skychain';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-import-skychain',
  templateUrl: './import-skychain.component.html',
  styleUrls: ['./import-skychain.component.css']
})
export class ImportSkychainComponent implements OnInit {
  @ViewChild(FileUpload) fileUploader: FileUpload;
  importSkychainForm: FormGroup;
  submitted: boolean;
  loading: boolean;
  importSkychain: ImportSkychain;
  defaultDate: Date;
  severity: string;
  msgs: Message[];
  constructor(private fb: FormBuilder, private transactionService: TransactionService, private constantService: ConstantService, private messageService: MessageService,) {
    this.importSkychainForm = this.fb.group({
      flightDate: ['', Validators.required]
    });
  }

  get f() {
    return this.importSkychainForm.controls;
  }

  ngOnInit(): void {
    this.defaultDate = new Date();
    this.importSkychain = new ImportSkychain();
    this.importSkychain.flightDate = null;
    this.msgs = [];
  }

  uploader(event) {
    this.submitted = true;

    // stop here if airlineform is invalid
    if (this.importSkychainForm.invalid) {
      return;
    }
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = this.handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  handleReaderLoaded(e) {
    this.importSkychain = new ImportSkychain();
    this.importSkychain.flightDate = this.f.flightDate.value;
    let str = e.target.result;
    str = str.split("base64,")[1];
    this.importSkychain.file = str;
    this.transactionService
      .save(environment.adminAPI, this.constantService.IMPORT_SKYCHAIN_URL, this.importSkychain)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            //this.msgs.push({severity:'info', summary:'Info Message', detail:'PrimeNG rocks'});
            this.messageService.add({
              severity: 'success',
              summary: 'Skychain',
              detail: data.responseDto.message,
              life: 3000,
            });
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Skychain',
              detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.loading = false;
          this.messageService.add({
            severity: 'error',
            summary: 'Skychain',
            detail: 'Por favor, intente más tarde.',
          });
        }
      );
  }
}
