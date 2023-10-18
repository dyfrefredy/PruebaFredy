import { ElementRef, forwardRef,Component, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { environment } from '../../../environments/environment';
import { NG_VALUE_ACCESSOR, ControlValueAccessor, FormControl } from '@angular/forms';
import { ConstantService } from '../../constant/constant-service';
import { User } from '../../model/user';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvUserComponent),
  multi: true,
};

@Component({
  selector: 'av-user',
  templateUrl: './av-user.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvUserComponent implements OnInit {

  @Input() label: string;
  @Input() labelList: string;
  @Input() options: User[];
  @Input() disabled: boolean = false;
  @Input() minLength: Number = 3;
  @Input() filter: boolean = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;
  // @Input() selectedStations:User[];
  @Input() selectionDocNum:User;
  @Input() control:FormControl;

  @ViewChild('input') inputRef: ElementRef;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }

  ngOnInit(): void {
  }

  getUser(name: String) {
    if (name != "") {
      this.transactionService.GetList(environment.adminAPI, this.constantService.USER_URL,  `/GetUsersByName/${name}` ).subscribe(
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
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  filteruser(event) {
    if (event.query.length >= this.minLength) {
      this.getUser(event.query);
    }
  }

  writeValue(value: any): void {
    this.selectionDocNum = value;
  }

  onSelect(value: any): void {
    this.zone.run(() => {
      this.propagateChange(value);
      this.selectionDocNum = value;
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
