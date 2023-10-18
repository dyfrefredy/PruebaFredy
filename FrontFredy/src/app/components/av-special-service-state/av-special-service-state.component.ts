import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvSpecialServiceStateComponent),
  multi: true,
};

@Component({
  selector: 'av-special-service-state',
  templateUrl: './av-special-service-state.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvSpecialServiceStateComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;

  @ViewChild('input') inputRef: ElementRef;
  selectionServiceState: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.getSpecialServiceState();
  }

  getSpecialServiceState() {
    this.transactionService.getAll(environment.customerServiceAPI, this.constantService.SPECIAL_SERVICE_STATE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  this.selectionLabel, value: 0 });
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
    this.selectionServiceState = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionServiceState);
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
