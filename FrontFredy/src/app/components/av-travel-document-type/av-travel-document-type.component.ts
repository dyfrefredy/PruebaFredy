import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvTravelDocumentTypeComponent),
  multi: true,
};

@Component({
  selector: 'av-travel-document-type',
  templateUrl: './av-travel-document-type.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvTravelDocumentTypeComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled: boolean = false;
  @Input() filter: boolean = true;
  @Input() guideTypeId: Number;

  @ViewChild('input') inputRef: ElementRef;
  selectionTravelDocumentType: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.guideTypeId = 0;
    this.getTravelDocumentType();
  }

  getTravelDocumentType() {
    this.transactionService.GetList(environment.adminAPI, this.constantService.TRAVEL_DOCUMENT_TYPE_URL, '/' + this.guideTypeId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label: 'Seleccione el tipo de documento de viaje', value: 0 });
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

  propagateChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.selectionTravelDocumentType = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionTravelDocumentType);
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
