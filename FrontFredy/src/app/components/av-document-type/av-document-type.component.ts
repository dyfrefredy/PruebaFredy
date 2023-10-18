import { Airline } from '../../model/airline';
import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';
import { Airport } from '../../model/airport';
import { environment } from '../../../environments/environment';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvDocumentTypeComponent),
  multi: true,
};

@Component({
  selector: 'av-document-type',
  templateUrl: './av-document-type.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvDocumentTypeComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionDocumentType: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.getRoles();
  }

  getRoles(){
    this.transactionService.getAll(environment.adminAPI, this.constantService.DOCUMENT_TYPE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  'Seleccione tipo de documento', value: 0 });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.options.push({ label: data.businessDto[index].description, value: data.businessDto[index].id });
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
    this.selectionDocumentType = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionDocumentType);
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
