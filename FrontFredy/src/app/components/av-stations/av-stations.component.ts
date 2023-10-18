import { Component, forwardRef, ViewChild, ElementRef, NgZone, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvStationsComponent),
  multi: true,
};

@Component({
  selector: 'av-stations',
  templateUrl: './av-stations.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvStationsComponent implements ControlValueAccessor, OnInit {

  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionStation: any;

  constructor(private zone: NgZone,
    private transactionService: TransactionService,
    private constantService: ConstantService) {
  }

  ngOnInit() {
  }

  search(event) {
    this.getStations(event.query);
  }

  getStations(name) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.STATION_URL, '/GetStationByName/' + name).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          for (let index = 0; index < data.businessDto.length; index++) {
            this.options.push({ label: data.businessDto[index].description + " (" + data.businessDto[index].name + ")", value: data.businessDto[index].id });
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
    this.selectionStation = value;
  }
  onSelect(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionStation.value);
    });
  }

  onClear(): void {
    this.zone.run(() => {
      this.propagateChange(null);
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
