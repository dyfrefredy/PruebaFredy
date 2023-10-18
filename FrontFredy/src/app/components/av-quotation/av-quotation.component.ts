import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { Quotation } from '../../model/quotation';
import { TransactionService } from '../../services/transaction.service';
import moment from 'moment';


export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvQuotationComponent),
  multi: true,
};

@Component({
  selector: 'av-quotation',
  templateUrl: './av-quotation.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvQuotationComponent implements OnInit {

  @Input() label: string;
  @Input() labelList: string;
  @Input() quotationSelected: Quotation[];
  @Input() disabled: boolean = false;
  @Input() minLength: Number = 0;
  @Input() filter: boolean = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;
  @Input() selectedStations:Quotation[];
  @Input() selectionQuotation:any;
  @Input() control:FormControl;
  @Input() email: String;
  @Output() childQuotation = new EventEmitter<any>();
  @Input() options: Array<{ label: string; value: any }>;
  RATE:String;
  DESTINATION_STATION:String;
  ORIGIN_STATION:String;

  @ViewChild('input') inputRef: ElementRef;

  constructor(private zone: NgZone, 
    private transactionService: TransactionService, 
    private constantService: ConstantService,
    private translateService: TranslateService) {
    
    this.RATE = this.translateService.instant('module.booking.rate', "moduleName");
    this.DESTINATION_STATION = this.translateService.instant('module.booking.destinationStationName', "moduleName");
    this.ORIGIN_STATION = this.translateService.instant('module.booking.originStationName', "moduleName");

  }

  ngOnInit(): void {
    this.getCitysByName(this.email);
  }

  getCitysByName(query: String) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.QUOTATION_URL, `/GetByEmail/${query}` ).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          data.businessDto.forEach(item => {
            this.options.push({ label: `ID: ${item.id} ${this.RATE}: ${item.quotationStatus.rate}
            ${moment(item.creationDate).format("YYYY/MM/DD")}
            ${this.DESTINATION_STATION}: ${item.destinationStationDesc}
            ${this.ORIGIN_STATION}: ${item.originStationDesc}`, value: item.id });
          });
          // this.translateService.instant('module.booking.rate', "moduleName")
          this.quotationSelected = data.businessDto;
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
    this.selectionQuotation = value;
  }
  onChange(): void {
    this.zone.run(() => {
      let selc = this.quotationSelected.filter(x=> x.id == this.selectionQuotation);
      this.propagateChange(selc[0]);
      this.childQuotation.emit();
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
