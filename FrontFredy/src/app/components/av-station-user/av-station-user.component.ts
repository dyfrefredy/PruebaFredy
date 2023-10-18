import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { User } from '../../model/user';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvStationUserComponent),
  multi: true,
};

@Component({
  selector: 'av-station-user',
  templateUrl: './av-station-user.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})

export class AvStationUserComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;
  @ViewChild('input') inputRef: ElementRef;
  user:User;
  selectionStation: any;

  constructor(private zone: NgZone, private authService: AuthService, private transactionService: TransactionService, private constantService: ConstantService) {
    this.user = this.authService.currentUserValue;
    this.getStation(this.user.id);
  }

  getStation(userId:Number) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.USER_STATION_URL, '/GetStationUser/' + this.active + '/' + userId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  this.selectionLabel, value: null });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.options.push({ label: data.businessDto[index].stationDesc, value: data.businessDto[index].stationId });
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
    this.selectionStation = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionStation.value);
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
