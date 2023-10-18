import {  Component,  forwardRef,  ViewChild,  ElementRef,  NgZone,  Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => AvQuotationRejectedComponent),
  multi: true,
};

@Component({
  selector: 'av-quotation-rejected',
  templateUrl: './av-quotation-rejected.component.html',
  providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvQuotationRejectedComponent implements ControlValueAccessor {

  @Input() label: string;
  @Input() selectedLabel: string;
  @Input() options: Array<{ label: string; value: any }>;
  @Input() disabled = false;
  @Input() filter = false;

  @ViewChild('input') inputRef: ElementRef;
  selectionQuotationRejected: any;

  constructor(private zone: NgZone) {
    this.getQuotationRejected();
  }

  getQuotationRejected() {
    this.options = new Array();
    this.options.push({ label:  this.selectedLabel, value: null });
    this.options.push({ label: "Tarifa", value: "Tarifa" });
    this.options.push({ label: "Cambio de condiciones de la cotización", value: "Cambio de condiciones de la cotización" });
    this.options.push({ label: "Embarque cancelado", value: "Embarque cancelado" });
    this.options.push({ label: "Negocio perdido", value: "Negocio perdido" });
    this.options.push({ label: "Otra", value: "Otra" });
  }

  propagateChange = (_: any) => {};
  onTouched = () => {};

  writeValue(value: any): void {
    this.selectionQuotationRejected = value;
  }
  onChange(): void {
    this.zone.run(() => {
      this.propagateChange(this.selectionQuotationRejected);
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
