import { Component, forwardRef, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => AvSelectComponent),
	multi: true
};

@Component({
	selector: 'av-select',
	templateUrl: './av-select.component.html',
	providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvSelectComponent implements ControlValueAccessor {
	@Input() label: string;
	@Input() options: Array<{ name: string, code: any }>;
	@Input() disabled = false;
	@Input() filter = false;

	@ViewChild('input') inputRef: ElementRef;
	value: any;

	constructor(private zone: NgZone) { }

	propagateChange = (_: any) => { };
	onTouched = () => { };

	writeValue(value: any): void {
		this.value = value;
	}
	onChange(): void {
		this.zone.run(() => {
			this.propagateChange(this.value);
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
