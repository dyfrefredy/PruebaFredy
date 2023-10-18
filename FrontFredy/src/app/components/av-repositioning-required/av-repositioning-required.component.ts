import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvRepositioningRequiredComponent),
  multi: true,
};

@Component({
  selector: 'av-repositioning-required',
  templateUrl: './av-repositioning-required.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvRepositioningRequiredComponent implements ControlValueAccessor, OnInit {
  @Input() label: string;
  @Input() selectedLabel: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  temperatureControlRequired: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }
  
  ngOnInit(){
    this.getOptions();
  }

  getOptions() {
    console.log(this.selectedLabel);
    this.options = new Array();
    this.options.push({ label:  this.selectedLabel, value: undefined });
    this.options.push({ label: "Yes", value: "Yes" });
    this.options.push({ label: "No", value: "No" });
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.temperatureControlRequired = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.temperatureControlRequired);
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
