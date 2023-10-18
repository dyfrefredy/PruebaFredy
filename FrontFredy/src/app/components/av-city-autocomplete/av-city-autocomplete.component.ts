import {  Component, forwardRef, ViewChild, ElementRef, NgZone, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { ConstantService } from "../../constant/constant-service";
import { TransactionService } from "../../services/transaction.service";
import { environment } from "../../../environments/environment";
import { City } from "../../model/city";

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvCityAutoCompleteComponent),
  multi: true,
};

@Component({
  selector: "av-city-autocomplete",
  templateUrl: "./av-city-autocomplete.component.html",
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvCityAutoCompleteComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() selectionLabel: string;
  @Input() formControlName: string;
  @Input() filter: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() multiple: boolean = false;
  @Input() dropdown: boolean = true;
  @Input() options: City[];
  @Input() minLength: Number = 3;
  @Input() selectionCity: City;
  @Output() sendCity: EventEmitter<City> = new EventEmitter<City>();

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {}
  ngOnInit(): void {

  }

  getCitysByName(query: String) {
    if (query != "") {
      this.transactionService.GetList(environment.adminAPI,this.constantService.CITY_URL,"/GetCitysByName/" + query).subscribe(
          (data) => {
            if (
              data.responseDto.response === this.constantService.RESPONSE_OK
            ) {
              this.options = data.businessDto;
            }
          },
          (error) => {
            console.log("Error: " + error);
          }
        );
    } else {
      this.onChange(new City());
    }
  }

  onDropdownClick(value: any): void{
    this.getCitysByName(value.query);
  }

  filterCitysByName(event) {
    if (event.query.length >= this.minLength) {
      this.getCitysByName(event.query);
    }
  }

  get value(): any {
    return this.selectionCity;
  }

  set value(v: any) {
    if (v !== this.selectionCity) {
      this.selectionCity = v;
      this.onChange(v);
    }
  }

  onSelect(value: any): void {
    this.zone.run(() => {
      this.onChange(value);
    });
  }

  writeValue(value: any) {
    this.selectionCity = value;
    this.onChange(value);
  }

  onChange = (_) => {};
  onTouched = () => {};
  registerOnChange(fn: (_: any) => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  onClear() {
    this.selectionCity = new City();
    this.sendCity.emit(this.selectionCity);
  }
}
