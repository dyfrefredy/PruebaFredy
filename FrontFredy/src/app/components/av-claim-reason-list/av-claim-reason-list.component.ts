import { Component, ElementRef, forwardRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { StorageService } from '../../services/storage.service';
import { TransactionService } from '../../services/transaction.service';


export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvClaimReasonListComponent),
  multi: true,
};


@Component({
  selector: 'av-claim-reason-list',
  templateUrl: './av-claim-reason-list.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvClaimReasonListComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;


  @ViewChild('input') inputRef: ElementRef;

  selectionReason: any;


  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService, private storageService: StorageService) {
    this.getClaimReason();
  }

  getClaimReason() {
    let lang = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang
    this.transactionService.GetList(environment.claimsAPI, this.constantService.REASON_URL, '').subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  this.selectionLabel, value: 0 });
          for (let index = 0; index < data.businessDto.length; index++) {
            if (lang == "es") {
              this.options.push({ label: data.businessDto[index].descriptionSpanish, value: data.businessDto[index].reasonCode });
            } else {
              this.options.push({ label: data.businessDto[index].descriptionEnglish, value: data.businessDto[index].reasonCode });
            }
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }


  propagateChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.selectionReason = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionReason);
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
