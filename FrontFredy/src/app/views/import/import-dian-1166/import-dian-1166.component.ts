import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FileUpload } from 'primeng/fileupload';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { ImportDiam1166 } from '../../../model/import-diam-1166';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-import-dian-1166',
  templateUrl: './import-dian-1166.component.html',
  styleUrls: ['./import-dian-1166.component.css']
})
export class ImportDian1166Component implements OnInit {
  @ViewChild(FileUpload) fileUploader: FileUpload;
  importDiam166Form: FormGroup;
  submitted: boolean;
  loading: boolean;
  importDiam1166: ImportDiam1166;

  constructor(private fb: FormBuilder, private transactionService: TransactionService, private constantService: ConstantService) {
    this.importDiam166Form = this.fb.group({
      airlineId: ['', Validators.required]
    });
  }

  get f() {
    return this.importDiam166Form.controls;
  }

  ngOnInit(): void {
    this.importDiam1166 = new ImportDiam1166();
  }

  uploader(event) {
    this.submitted = true;

    // stop here if airlineform is invalid
    if (this.importDiam166Form.invalid) {
      return;
    }
    const file = event.files[0];
    const reader = new FileReader();
    reader.onload = this._handleReaderLoaded.bind(this);
    reader.readAsDataURL(file);
  }

  _handleReaderLoaded(e) {
    this.importDiam1166 = new ImportDiam1166();
    this.importDiam1166.airlineId = this.f.airlineId.value;
    let str = e.target.result;
    str = str.split("base64,")[1];
    this.importDiam1166.file = str;
    this.transactionService
      .save(environment.adminAPI, this.constantService.IMPORT_DIAN_URL, this.importDiam1166)
      .subscribe((rst) => {
        console.log(rst);
        this.fileUploader.clear();
      });
  }
}
