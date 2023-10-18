import { Component, ElementRef, forwardRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { StorageService } from '../../services/storage.service';
import { TransactionService } from '../../services/transaction.service';


export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvClaimReasonComponent),
  multi: true,
};


@Component({
  selector: 'av-claim-reason',
  templateUrl: './av-claim-reason.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvClaimReasonComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() claimMotive: Array<{ name: string; key: any; code: any; limitDays: number; }>;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;
  @Input() selectionLimit: Number = 0;

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
          this.claimMotive = new Array();
          for (let index = 0; index < data.businessDto.length; index++) {
            if (lang == "es") {
              this.claimMotive.push({ name: data.businessDto[index].descriptionSpanish, key: data.businessDto[index].id, code: data.businessDto[index].reasonCode, limitDays : data.businessDto[index].claimLimitDays });
            } else {
              this.claimMotive.push({ name: data.businessDto[index].descriptionEnglish, key: data.businessDto[index].id, code: data.businessDto[index].reasonCode, limitDays : data.businessDto[index].claimLimitDays });
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
      // if(this.arrayLength != 0){
      //   if(this.selectionReason.length <= this.arrayLength)
      //     this.propagateChange(this.selectionReason);
      //   else{
      //     this.selectionReason.pop();
      //     this.propagateChange(this.selectionReason);
      //   }
      // }
      // else
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
