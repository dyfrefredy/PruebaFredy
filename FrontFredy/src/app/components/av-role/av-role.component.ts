import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { User } from '../../model/user';
import { AuthService } from '../../services/auth.service';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvRoleComponent),
  multi: true,
};

@Component({
  selector: 'av-role',
  templateUrl: './av-role.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvRoleComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionRole: any;
  userLogin: User;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService,
    private authService: AuthService
  ) {
    this.userLogin = this.authService.currentUserValue;
    this.getRoles();
  }

  getRoles(){
    this.transactionService.getAll(environment.adminAPI, this.constantService.ROL_URL + '/' + this.userLogin.id).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.options = new Array();
          this.options.push({ label:  'Seleccione rol', value: 0 });
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

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectionRole = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionRole);
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
