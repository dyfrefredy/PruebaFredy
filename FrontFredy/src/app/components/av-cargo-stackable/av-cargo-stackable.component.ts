import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvCargoStackableComponent),
  multi: true,
};

@Component({
  selector: 'av-cargo-stackable',
  templateUrl: './av-cargo-stackable.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvCargoStackableComponent implements ControlValueAccessor, OnInit {
  @Input() label: string;
  @Input() selectedLabel: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionCargoStackable: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }
  
  ngOnInit(){
    this.getCargoStackables();
  }

  getCargoStackables() {
    this.options = new Array();
    this.options.push({ label:  this.selectedLabel, value: "" });
    this.options.push({ label: "Yes", value: "Yes" });
    this.options.push({ label: "No", value: "No" });
    this.options.push({ label: "Top load", value: "Top load" });
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectionCargoStackable = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionCargoStackable);
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