import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvTemperatureRangeComponent),
  multi: true,
};

@Component({
  selector: 'av-temperature-range',
  templateUrl: './av-temperature-range.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvTemperatureRangeComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;
  @Input() selectedLabel: string;
  @ViewChild('input') inputRef: ElementRef;
  selectionAvTemperatureRange: any;

  @Output() sendDescription: EventEmitter<String> = new EventEmitter<String>();
  descriptionTemperatureRange: String;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.getPerishables();
  }

  getPerishables(){
    this.transactionService.getAll(environment.adminAPI, this.constantService.TEMPERATURE_RANGE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  this.selectedLabel, value: 0 });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.options.push({ label: data.businessDto[index].name, value: data.businessDto[index].id });
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
    this.selectionAvTemperatureRange = value;
  }
  
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionAvTemperatureRange);
    });
    var item = this.options.filter(f => f.value == this.selectionAvTemperatureRange);
    this.descriptionTemperatureRange = item[0].label;
    this.sendDescription.emit(this.descriptionTemperatureRange);
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
