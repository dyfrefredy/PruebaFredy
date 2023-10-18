import { ElementRef, forwardRef, Input } from '@angular/core';
import { Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { GuideActive } from '../../model/guide-active';
import { SelectWaybill } from '../../model/select-waybill';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvAwbAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'av-awb-autocomplete',
  templateUrl: './av-awb-autocomplete.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvAwbAutocompleteComponent implements OnInit {

  @Input() label: string;
  @Input() selectionLabel: string;
  @Input() formControlName: string;
  @Input() filter: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() multiple: boolean = false;
  @Input() dropdown: boolean = true;
  @Input() options: SelectWaybill[];
  @Input() minLength: Number = 4;
  @Input() selectionDocNum: SelectWaybill;

  @ViewChild('input') inputRef: ElementRef;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }

  ngOnInit(): void {
    this.selectionDocNum = new  SelectWaybill();
  }

  getAwb(name: String) {
    if (name != "") {
      this.transactionService.GetList(environment.pharmaAPI, this.constantService.WAYBILL_RPA_URL,  `/docNum/${name}` ).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.options = data.businessDto;
          }
        },
        (error) => {
          console.log('Error: ' + error);
        }
      );
    }
    else {
      this.onChange(new GuideActive());
    }
  }


  onDropdownClick(value: any): void{
    this.getAwb(value.query);
  }

  filterAwbsByName(event) {
    if (event.query.length > this.minLength) {
      this.getAwb(event.query);
    }
  }

  get value(): any {
    return this.selectionDocNum;
  }

  set value(v: any) {
    if (v !== this.selectionDocNum) {
      this.selectionDocNum = v;
      this.onChange(v);
    }
  }

  onSelect(value: any): void {
    this.zone.run(() => {
      this.onChange(value.value);
    });
  }

  writeValue(value: any) {
    if(value != undefined && value != ""){
      this.selectionDocNum.id = value;
      this.selectionDocNum.value = value;
      this.onChange(value);
    }
  }

  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

}
