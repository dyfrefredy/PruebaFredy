import { Airline } from './../../model/airline';
import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit, EventEmitter, Output } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormGroup } from '@angular/forms';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';
import { Airport } from '../../model/airport';
import { TranslateService } from '@ngx-translate/core';
import { UserSetting } from '../../model/user-setting';
import { StorageService } from '../../services/storage.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvItineraryCategoryTypeComponent),
  multi: true,
};

@Component({
  selector: 'av-itinerary-category-type',
  templateUrl: './av-itinerary-category-type.component.html',
  styleUrls: ['./av-itinerary-category-type.component.css'],
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvItineraryCategoryTypeComponent implements ControlValueAccessor, OnInit {
  @Input() selectedOption: any;
  @Input() inputId: string;
  @Input() value: string;
  @Input() label: string;
  @Input() inputName: string;
  @Input() group: FormGroup;
  @Input() icon: string;

  @Output() selectedOptionChange: EventEmitter<any> = new EventEmitter<any>();

  city: string;
  userSetting: UserSetting;
  categories: any[];

  constructor(
    private zone: NgZone,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private storageService: StorageService,
    private translateService: TranslateService
  ) {
  }

  ngOnInit() {
    this.userSetting = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE);
    if (this.userSetting == null) {
      this.userSetting = new UserSetting();
      this.userSetting.lang = 'en';
      this.storageService.setSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE, JSON.stringify(this.userSetting));
      this.translateService.use(this.userSetting.lang);
    } else {
      this.translateService.use(this.userSetting.lang);
    }

    this.categories = [
      { name: this.translateService.instant('module.searchItinerary.all', "all"), key: 0 },
      { name: this.translateService.instant('module.searchItinerary.onlyPassengers', "onlyPassengers"), key: 1 },
      { name: this.translateService.instant('module.searchItinerary.onlyCommodity', "onlyCommodity"), key: 2 }];

    this.selectedOption = this.categories[0];
  }

  onChange = (_: any) => { };
  onTouched = () => { };


  writeValue(value: any): void {
    if (value != undefined) {
      this.onChange(value);
    }
  }


  registerOnChange(fn: (_: any) => {}): void {
    this.onChange = fn;
  }


  registerOnTouched(fn: () => {}): void {
    this.onTouched = fn;
  }
}
