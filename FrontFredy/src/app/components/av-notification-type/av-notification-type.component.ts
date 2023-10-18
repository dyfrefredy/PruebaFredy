import { Component, forwardRef, ViewChild, ElementRef, NgZone, Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';
import { TranslateService } from '@ngx-translate/core';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvNotificationTypeComponent),
  multi: true,
};


@Component({
  selector: 'av-notification',
  templateUrl: './av-notification-type.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvNotificationTypeComponent implements ControlValueAccessor, OnInit {

  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionNotificationType: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService,private translateService: TranslateService) {
  }

  ngOnInit() {

    this.getNotificationTypes();
  }

  getNotificationTypes() {

    this.transactionService.getAll(environment.claimsAPI, this.constantService.NOTIFICATION_TYPE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label: this.translateService.instant('module.language.select', "moduleName"), value: null });
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
    this.selectionNotificationType = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionNotificationType);
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
