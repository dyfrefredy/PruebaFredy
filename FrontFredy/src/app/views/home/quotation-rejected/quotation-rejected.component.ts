import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { TransactionService } from '../../../services/transaction.service';
import { environment } from '../../../../environments/environment';
import { TranslateService } from "@ngx-translate/core";
import { StorageService } from '../../../services/storage.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { QuotationStatus } from '../../../model/quotation-status';

@Component({
  selector: 'app-quotation-rejected',
  templateUrl: './quotation-rejected.component.html',
  styleUrls: ['./quotation-rejected.component.css']
})
export class QuotationRejectedComponent implements OnInit {

  quotationForm: FormGroup;
  description: String;
  rejected: String;
  id: number;
  editMode = false;
  constructor(
    private fb: FormBuilder,
    private confirmationService: ConfirmationService,
    private route: ActivatedRoute,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService) {
    this.quotationForm = this.fb.group({
      rejected: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.id = Number.parseInt(params.get('id'));
    });
  }

  save() {

    let quotationStatus = new QuotationStatus();
    quotationStatus.quotationId = this.id;
    quotationStatus.description = this.description;
    quotationStatus.rejectedType = this.rejected;
    this.transactionService.update(environment.customerServiceAPI, this.constantService.QUOTATIONSTATUS_URL, quotationStatus).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'Ok',
            summary: 'Peticion correcta',
            detail: 'Por favor, intente más tarde.',
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'rechazada',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }
}
