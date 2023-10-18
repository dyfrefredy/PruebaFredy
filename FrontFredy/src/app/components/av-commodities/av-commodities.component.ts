import { Component, ElementRef, forwardRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';



export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvCommoditiesComponent),
  multi: true,
};


@Component({
  selector: 'av-commodities',
  templateUrl: './av-commodities.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvCommoditiesComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() options: Array<{ label: string; value: any; id: any }>;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;


  @ViewChild('input') inputRef: ElementRef;
  selectionCommodities: any;


  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.getCommodity();
  }

  getCommodity() {
    this.transactionService.GetList(environment.claimsAPI, this.constantService.COMMODITY_URL, '').subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label: this.selectionLabel, value: 0, id: 0 });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.options.push({ label: data.businessDto[index].descriptionEnglish, value: data.businessDto[index].codeCargoType, id: data.businessDto[index].id });
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
    this.selectionCommodities = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionCommodities);
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
