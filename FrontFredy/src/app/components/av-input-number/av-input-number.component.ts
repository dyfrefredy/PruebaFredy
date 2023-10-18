import {
  Component,
  forwardRef,
  ViewChild,
  ElementRef,
  NgZone,
  Input,
} from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvInputNumberComponent),
  multi: true,
};

@Component({
  selector: 'av-input-number',
  templateUrl: './av-input-number.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvInputNumberComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() size = '20';
  @Input() maxlength: string;
  @Input() disabled = false;
  @ViewChild('input') inputRef: ElementRef;
  value: Number;

  constructor(private zone: NgZone) { }

  propagateChange = (_: Number) => {};

  propagateTouched = (_: Number) => { };


  writeValue(value: Number): void {
    this.value = value;
  }

  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(Number(this.value));
    });
  }

  onTouched() {
    this.zone.run(() => {
      this.propagateTouched(Number(this.value));
    });
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.propagateTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  numberOnly(event: KeyboardEvent) {
    const pattern = /^\d$/g;
    let inputChar = String.fromCharCode(event.keyCode);
    if (!pattern.test(inputChar)) {
      event.preventDefault();
    }
  }
}
