import { Component, OnInit, forwardRef, ViewChild, ElementRef, NgZone, Input, Output, EventEmitter } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

export const AV_CONTROL_VALUE_ACCESSOR: any = {
	provide: NG_VALUE_ACCESSOR,
	useExisting: forwardRef(() => AvListboxComponent),
	multi: true
};

@Component({
	selector: 'av-listbox',
	templateUrl: './av-listbox.component.html',
	styleUrls: ['./av-listbox.component.scss'],
	providers: [AV_CONTROL_VALUE_ACCESSOR],
})
export class AvListboxComponent implements OnInit, ControlValueAccessor {
	@Input() label: string;
	@Input() options: Array<{ value: string, label: string }>;
	@Input() disabled = false;
	@Input() selectable = false;
	@Output() selectOption = new EventEmitter();

	selected: number;
	values: Array<any>;

	constructor(private zone: NgZone) { }

	ngOnInit(): void { }

	propagateChange = (_: any) => { };
	onTouched = () => { };

	writeValue(values: any): void {
		this.values = values;
	}

	select(i: number): void {
		if (this.selectable) {
			this.selected = i;
			this.selectOption.emit(i);
		}
	}
	onChange(): void {
		this.zone.run(() => {
			this.propagateChange(this.values);
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
