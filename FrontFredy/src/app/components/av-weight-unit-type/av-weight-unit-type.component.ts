import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvWeightUnitTypeComponent),
  multi: true,
};

@Component({
  selector: 'av-weight-unit-type',
  templateUrl: './av-weight-unit-type.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvWeightUnitTypeComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() selectionLabel: string = 'Seleccione unidad';
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;

  @Output() sendDescription: EventEmitter<String> = new EventEmitter<String>();

  selectionUnit: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.getWeightUnits();
  }

  getWeightUnits() {
    this.transactionService.GetList(environment.adminAPI, this.constantService.MEASUREMENT_UNIT_URL, '/GetWeight').subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label: this.selectionLabel, value: undefined });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.options.push({ label: data.businessDto[index].description, value: data.businessDto[index].id });
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
    this.selectionUnit = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionUnit);

      var description = this.options.filter(f => f.value == this.selectionUnit);
      this.sendDescription.emit(description[0].label);
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
