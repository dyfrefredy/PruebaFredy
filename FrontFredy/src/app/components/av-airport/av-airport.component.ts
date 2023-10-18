import { Airline } from './../../model/airline';
import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';
import { Airport } from '../../model/airport';
import { environment } from '../../../environments/environment';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvAirportComponent),
  multi: true,
};

@Component({
  selector: 'av-airport',
  templateUrl: './av-airport.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvAirportComponent implements ControlValueAccessor {
  @Input() label: string;
  //@Input() options: Array<{ label: string; value: any }>;
  @Input() options: Airport[];
  @Input() disabled: boolean = false;
  @Input() minLength: Number = 3;
  @Input() filter: boolean = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;

  @ViewChild('input') inputRef: ElementRef;
  selectionAriport: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }

  getAirport(query: String) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.AIRPORT_URL, '/GetAirport/' + query ).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = data.businessDto;
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  filterAirport(event) {
    if (event.query.length >= this.minLength) {
      this.getAirport(event.query);
    }
  }

  writeValue(value: any): void {
    this.selectionAriport = value;
  }

  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionAriport);
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
