import { Component, forwardRef, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { DefaultService } from '../../services/default.service';


export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvInputRangeDateComponent),
  multi: true
};

@Component({
  selector: 'av-input-range-date',
  templateUrl: './av-input-range-date.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvInputRangeDateComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() size = '20';
  @Input() format = 'dd/mm/yy';
  @Input() disabled: Boolean = false;
  @Input() showIcon: Boolean = true;
  @Input() showTime: Boolean = false;
  @Input() placeholder: String;
  @Input() yearNavigator: Boolean = true;
  @Input() yearRange: String;
  @Input() monthNavigator: Boolean = true;
  @Input() defaultDate: Date = new Date();
  @ViewChild('input') inputRef: ElementRef;
  value: any;
  calendar: any;


  constructor(
    private zone: NgZone,
    private defaultService: DefaultService
  ) {
    this.calendar = this.defaultService.calendar;
  }

  propagateChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.value = value;
  }

  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.value);
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
