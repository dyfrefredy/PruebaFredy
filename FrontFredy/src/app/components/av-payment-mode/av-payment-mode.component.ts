import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvPaymentModeComponent),
  multi: true,
};

@Component({
  selector: 'av-payment-mode',
  templateUrl: './av-payment-mode.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvPaymentModeComponent implements OnInit, ControlValueAccessor {

  @Input() label: string;
  @Input() selectedLabel: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionChargeType: any;

  constructor(private zone: NgZone) {
    
  }

  ngOnInit(): void 
  { 
    this.options = new Array();
    
    this.options.push({ label:  this.selectedLabel, value: '0' });
    this.options.push({ label:  'Prepaid', value: 'Prepaid' });
    this.options.push({ label:  'Collect', value: 'Collect' });

  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectionChargeType = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionChargeType);
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
