import { Component, ElementRef, forwardRef, Input, NgZone, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ConstantService } from '../../constant/constant-service';
import { TransactionService } from '../../services/transaction.service';


export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvFileTypeComponent),
  multi: true,
};

@Component({
  selector: 'av-file-type',
  templateUrl: './av-file-type.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR]
})
export class AvFileTypeComponent implements ControlValueAccessor, OnInit {

  @Input() label: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionLanguage: any;

  constructor(private zone: NgZone, private transactionService: TransactionService, private constantService: ConstantService, private translateService: TranslateService) {


  }

  ngOnInit() {
    this.getFileType();
  }

  getFileType() {
    this.options = new Array();
    this.options.push({ label: this.translateService.instant('module.language.select', "moduleName"), value: null });
    this.options.push({ label: this.translateService.instant('module.CBP.fileType.fileIn', "moduleName"), value: 1 });
    this.options.push({ label: this.translateService.instant('module.CBP.fileType.fileOut', "moduleName"), value: 2 });
    this.options.push({ label: this.translateService.instant('module.CBP.fileType.fileLog', "moduleName"), value: 3 });
  }

  propagateChange = (_: any) => { };
  onTouched = () => { };

  writeValue(value: any): void {
    this.selectionLanguage = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionLanguage);
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
