import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';
import { Component, ElementRef, forwardRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { SelectItem } from 'primeng/api';
import { environment } from '../../../environments/environment';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvCountryComponent),
  multi: true,
};

@Component({
  selector: 'av-country',
  templateUrl: './av-country.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvCountryComponent implements OnInit, ControlValueAccessor {
  @Input() label: string;
  @Input() options: SelectItem[];
  @Input() formControlName: any;
  @Input() placeholder: string;
  @Input() multiple: boolean = false;
  @Input() disabled = false;
  @Input() filteredOptions: Array<{ label: string; value: any }>;

  //filteredOptions: SelectItem[] = [];
  // autoCompleteControl: FormControl = new FormControl(null);
  autoCompleteControl: FormControl;

  selectedValues: Array<{}>

  selection: any;


  @ViewChild('input') inputRef: ElementRef;
  selectionCountry: any;

  constructor(private zone: NgZone,private fb: FormBuilder, private transactionService: TransactionService, private constantService: ConstantService) {
    this.autoCompleteControl = this.fb.control(null);
  }

  ngOnInit() {
  }

  search(event) {
    this.getCountry(event.query);
  }


  getCountry(query: String) {
    this.transactionService.GetList(environment.adminAPI,this.constantService.COUNTRY_URL, '/GetCountry/' + query).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.filteredOptions = new Array();
          for (let index = 0; index < data.businessDto.length; index++) {
            this.filteredOptions.push({ label: data.businessDto[index].countryName, value: data.businessDto[index].id });
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
    this.selectionCountry = value;
  }
  onSelect(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionCountry.value);
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
