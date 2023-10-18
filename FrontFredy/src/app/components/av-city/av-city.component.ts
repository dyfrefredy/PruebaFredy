import { Component, forwardRef, ViewChild, ElementRef, NgZone, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';
import { environment } from '../../../environments/environment';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvCityComponent),
  multi: true,
};

@Component({
  selector: 'av-city',
  templateUrl: './av-city.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvCityComponent implements ControlValueAccessor, OnInit {
  @Input() label: string;
  @Input() options: Array<{ label: string; description:string; value: any }>;
  @Input() disabled: boolean = false;
  @Input() filter: boolean = true;
  @Input() active: boolean = true;
  @Input() selectionLabel: string;

  @ViewChild('input') inputRef: ElementRef;
  selectionCity: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {

  }

  ngOnInit(): void {
    this.getCity();
  }

  getCity() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.CITY_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  this.selectionLabel, description:this.selectionLabel, value: 0 });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.options.push({ label: data.businessDto[index].cityIata, description:data.businessDto[index].cityName, value:data.businessDto[index].id });
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectionCity = value;
  }

  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionCity.value);
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
