import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvSkychainComponent),
  multi: true,
};

@Component({
  selector: 'av-skychain',
  templateUrl: './av-skychain.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvSkychainComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled: boolean = false;
  @Input() filter: boolean = true;
  @Input() flightDate: Date;
  @Input() airlineId: number;
  @Input() flightNumber: number;

  @ViewChild('input') inputRef: ElementRef;
  selectionSkychain: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.flightDate = new Date("2020-11-27 00:00:00");
    this.airlineId = 5;
    this.flightNumber = 4003;
    this.options = new Array();
    this.options.push({ label: 'Seleccione guía master Skychain', value: 0 });
    //this.getSkychain();
  }

  getSkychain() {
    if (this.flightDate && this.airlineId && this.flightNumber && this.airlineId !== 0 && this.flightNumber !== 0) {
        this.transactionService.GetList(environment.adminAPI, this.constantService.SKYCHAIN_URL, '/' + this.flightDate.toISOString() + '/'+ this.airlineId + '/' + this.flightNumber).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            for (let index = 0; index < data.businessDto.length; index++) {
              this.options.push({ label: data.businessDto[index].awb, value: data.businessDto[index].id });
            }
          }
        },
        (error) => {
          console.log('Error: ' + error);
        }
      );
    }
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectionSkychain = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionSkychain);
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
