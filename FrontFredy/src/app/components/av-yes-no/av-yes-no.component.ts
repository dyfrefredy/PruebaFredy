import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvYesNoComponent),
  multi: true,
};

@Component({
  selector: 'av-yes-no',
  templateUrl: './av-yes-no.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvYesNoComponent implements ControlValueAccessor, OnInit {
  @Input() label: string;
  @Input() selectedLabel: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;
  @Input() variableName: String;

  @Output() sendVariableName: EventEmitter<String> = new EventEmitter<String>();

  @ViewChild('input') inputRef: ElementRef;

  selectedAnswer: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }
  
  ngOnInit(){
    this.getOptions();
  }

  getOptions() {
    //console.log(this.selectedLabel);
    this.options = new Array();
    this.options.push({ label:  this.selectedLabel, value: undefined });
    this.options.push({ label: "Yes", value: "Yes" });
    this.options.push({ label: "No", value: "No" });
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectedAnswer = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectedAnswer);
      this.sendVariableName.emit(this.variableName);
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
