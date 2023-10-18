import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvContainerTypeComponent),
  multi: true,
};

@Component({
  selector: 'av-container-type',
  templateUrl: './av-container-type.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvContainerTypeComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;
  @Input() selectedLabel: string;

  @ViewChild('input') inputRef: ElementRef;
  selectionContainerType: any;

  @Output() sendDescription: EventEmitter<String> = new EventEmitter<String>();
  descriptionContainerType: String;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
    this.getContainerTypes();
  }

  getContainerTypes(){
    this.transactionService.getAll(environment.adminAPI, this.constantService.CONTAINER_TYPE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  this.selectedLabel, value: 0 });
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
    this.selectionContainerType = value;
  }

  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionContainerType);
    });

    var item = this.options.filter(f => f.value == this.selectionContainerType);
    this.descriptionContainerType = item[0].label;
    this.sendDescription.emit(this.descriptionContainerType);
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
