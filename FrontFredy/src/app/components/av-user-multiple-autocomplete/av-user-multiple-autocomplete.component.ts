import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input, OnInit } from '@angular/core';
import { NG_VALUE_ACCESSOR, FormControl } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { User } from '../../model/user';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvUserMultipleAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'av-user-multiple-autocomplete',
  templateUrl: './av-user-multiple-autocomplete.component.html',
  styleUrls: ['./av-user-multiple-autocomplete.component.scss'],
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvUserMultipleAutocompleteComponent implements OnInit {

  @Input() label: string;
  @Input() labelList: string;
  @Input() options: User[];
  @Input() disabled: boolean = false;
  @Input() minLength: Number = 3;
  @Input() filter: boolean = true;
  @Input() active: boolean = true;
  @Input() principal: boolean = true;
  @Input() selectionLabel: string;
  @Input() selectedUsers:User[];
  @Input() selectionUsersAvailable:User;
  @Input() control:FormControl;

  @ViewChild('input') inputRef: ElementRef;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService) {
  }

  ngOnInit(): void {
  }

  getCitysByName(query: String) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.USER_URL, '/GetUsersByName/' + query ).subscribe(
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

  addUser(){
    if(this.selectionUsersAvailable.id != undefined){
      var item = this.selectedUsers.filter(val => val.id === this.selectionUsersAvailable.id);
      if(item.length == 0){
        this.selectedUsers.push(this.selectionUsersAvailable);
      }
      return true;
    }
  }

  deleteUser(rowIndex:any){
    this.selectedUsers.splice(rowIndex,1);
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  filterCitysByName(event) {
    if (event.query.length >= this.minLength) {
      this.getCitysByName(event.query);
    }
  }

  writeValue(value: any): void {
    this.selectionUsersAvailable = value;
  }

  onSelect(value: any): void {
    this.zone.run(() => {
      this.propagateChange(value);
      this.selectionUsersAvailable = value;
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
