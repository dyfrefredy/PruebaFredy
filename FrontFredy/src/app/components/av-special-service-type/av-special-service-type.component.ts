import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { SpecialServiceType } from '../../model/special-service-type';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvSpecialServiceTypeComponent),
  multi: true,
};

  @Component({
  selector: 'av-special-service-type',
  templateUrl: './av-special-service-type.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvSpecialServiceTypeComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() selectionLabel: string = 'Seleccione tipo de servicio especial';
  @Input() options: SpecialServiceType[];
  @Input() disabled = false;
  @Input() filter = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;


  @ViewChild('input') inputRef: ElementRef;
  selectionServiceType: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.getSpecialServiceType();
  }

  getSpecialServiceType() {
    this.transactionService.getAll(environment.customerServiceAPI, this.constantService.SPECIAL_SERVICE_TYPE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = [];
          let selectedOption = new SpecialServiceType();
          selectedOption.id=null;
          selectedOption.description=this.selectionLabel;
          this.options.push(selectedOption);
          this.options.push(...data.businessDto);
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
    this.selectionServiceType = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionServiceType);
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
