import { Component, ElementRef, forwardRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { StorageService } from '../../services/storage.service';
import { TransactionService } from '../../services/transaction.service';


export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvClaimStatusComponent),
  multi: true,
};

@Component({
  selector: 'av-claim-status',
  templateUrl: './av-claim-status.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvClaimStatusComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;


  @ViewChild('input') inputRef: ElementRef;

  selectionStatus: any;


  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService, private storageService: StorageService) {
    this.getClaimStatus();
  }

  getClaimStatus() {
    let lang = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE).lang;
    this.options = new Array();
          
    if (lang == "es") {
      this.options.push(
          { label: "Selecciones estado", value: undefined},
          { label: "Formal", value: 1},
          { label: "Preliminar", value: 2},
          { label: "Extemporáneo", value: 3}
        );
    } else {
      this.options.push(
        { label: "Select status", value: undefined},
        { label: "Formal", value: 1},
        { label: "Preliminary", value: 2},
        { label: "Extemporaneous", value: 3}
      );
    }
        
      
      (error) => {
        console.log('Error: ' + error);
      }
  }


  propagateChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.selectionStatus = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionStatus);
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
