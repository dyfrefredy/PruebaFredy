import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { Shipper } from '../../model/shipper';
import { Station } from '../../model/station';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvShipperUserComponent),
  multi: true,
};

@Component({
  selector: 'av-shipper-user',
  templateUrl: './av-shipper-user.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvShipperUserComponent implements OnInit {

  @Input() label: string;
  @Input() labelList: string;
  @Input() options: Shipper[];
  @Input() disabled: boolean = false;
  @Input() minLength: Number = 3;
  @Input() filter: boolean = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;
  @Input() selectedStations:Shipper[];
  @Input() selectionstationsAvailable:Shipper;
  @Input() control:FormControl;
  @Input() userId:Number;
  @Output() childShipperDialog = new EventEmitter<any>();

  @ViewChild('input') inputRef: ElementRef;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }

  ngOnInit(): void {
  }

  getCitysByName(query: String) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.SHIPPER_INFORMATION, `/GetByName/${this.userId}/${query}` ).subscribe(
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

  filterCitysByName(event) {
    if (event.query.length >= this.minLength) {
      this.getCitysByName(event.query);
    }
  }

  writeValue(value: any): void {
    this.selectionstationsAvailable = value;
  }

  onSelect(value: any): void {
    this.zone.run(() => {
      this.propagateChange(value);
      this.selectionstationsAvailable = value;
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

  showShipper() {
    this.childShipperDialog.emit();
  }

}
