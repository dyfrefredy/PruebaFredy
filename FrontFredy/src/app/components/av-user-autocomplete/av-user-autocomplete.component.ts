import {  Component, forwardRef, ViewChild, ElementRef, NgZone, Input, OnInit, Output, EventEmitter } from "@angular/core";
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from "@angular/forms";
import { ConstantService } from "../../constant/constant-service";
import { TransactionService } from "../../services/transaction.service";
import { environment } from "../../../environments/environment";
import { User } from "../../model/user";

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvUserAutoCompleteComponent),
  multi: true,
};

@Component({
  selector: "av-user-autocomplete",
  templateUrl: "./av-user-autocomplete.component.html",
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvUserAutoCompleteComponent implements OnInit, ControlValueAccessor {  
  @Input() label: string;
  @Input() selectionLabel: string;
  @Input() formControlName: string;
  @Input() filter: boolean = true;
  @Input() forceSelection: boolean = true;
  @Input() multiple: boolean = false;
  @Input() dropdown: boolean = true;
  @Input() options: User[];
  @Input() minLength: Number = 3;
  @Input() selectionUser: User;
  @Input() disabled = false;
  @Output() sendUser: EventEmitter<User> = new EventEmitter<User>();
  @Input() userLoginId: Number;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {}
  
  ngOnInit(): void {
    console.log("forceSelection", this.forceSelection);
  }

  getUsersByName(query: String) {
    if (query != "") {
      this.transactionService.GetList(environment.adminAPI,this.constantService.USER_URL,`/GetUsersByName/${query}/${this.userLoginId}`).subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.options = data.businessDto;
            }
          },
          (error) => {
            console.log("Error: " + error);
          }
        );
    } else {
      this.onChange(new User());
    }
  }

  onDropdownClick(value: any): void{
    this.getUsersByName(value.query);
  }

  filterUsersByName(event) {
    if (event.query.length >= this.minLength) {
      this.getUsersByName(event.query);
    }    
  }

  get value(): any {
    return this.selectionUser;
  }

  set value(v: any) {
    if (v !== this.selectionUser) {
      this.selectionUser = v;
      this.onChange(v);
    }
  }

  onSelect(value: any): void {
    this.zone.run(() => {
      this.onChange(value);
      this.selectionUser = value;
    });
  }

  writeValue(value: any) {
    this.selectionUser = value;
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
    this.selectionUser = new User();
    this.sendUser.emit(this.selectionUser);
  }
}
