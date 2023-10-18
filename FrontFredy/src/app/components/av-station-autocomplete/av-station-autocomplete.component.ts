import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { Station } from '../../model/station';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvStationAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'av-station-autocomplete',
  templateUrl: './av-station-autocomplete.component.html',
  styleUrls: ['./av-station-autocomplete.component.scss'],
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvStationAutocompleteComponent implements OnInit {
  @Input() label: string;
  @Input() labelList: string;
  @Input() options: Station[];
  @Input() disabled: boolean = false;
  @Input() minLength: Number = 3;
  @Input() filter: boolean = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;
  @Input() selectedStations:Station[];
  @Input() selectionstationsAvailable:Station;
  @Input() control:FormControl;

  @ViewChild('input') inputRef: ElementRef;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }

  ngOnInit(): void {
  }

  getCitysByName(query: String) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.STATION_URL, '/GetStationByName/' + query ).subscribe(
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

  addStation(){
    if(this.selectionstationsAvailable.id != undefined){
      var item = this.selectedStations.filter(val => val.id === this.selectionstationsAvailable.id);
      if(item.length == 0){
        this.selectedStations.push(this.selectionstationsAvailable);
      }
      return true;
    }
  }

  deleteStation(rowIndex:any){
    this.selectedStations.splice(rowIndex,1);
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
}
