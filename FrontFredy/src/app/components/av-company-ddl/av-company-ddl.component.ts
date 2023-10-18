import { Component, forwardRef, ViewChild, ElementRef, NgZone, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { FilterQuery } from '../../model/filter-query';
import { Pagination } from '../../model/pagination';
import { TransactionService } from '../../services/transaction.service';

export const AV_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => AvCompanyDdlComponent),
    multi: true,
};

@Component({
    selector: 'av-company-ddl',
    templateUrl: './av-company-ddl.component.html',
    providers: [AV_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class AvCompanyDdlComponent implements ControlValueAccessor {
    @Input() label: string;
    @Input() options: Array<{ label: string; value: any }>;
    @Input() disabled = false;
    @Input() filter = false;

    @ViewChild('input') inputRef: ElementRef;
    selectionChargeType: any;

    pagination: Pagination;

    constructor(
        private zone: NgZone,
        private transactionService: TransactionService,
        private constantService: ConstantService) {
        this.getCompanyDdl();
    }

    getCompanyDdl() {
        this.transactionService.getAll(environment.CBPAPI, this.constantService.COMPANY_URL).subscribe(
            (data) => {
                if (data.responseDto.response === this.constantService.RESPONSE_OK) {
                    this.options = new Array();
                    this.options.push({ label: 'Seleccione compañia', value: null });
                    for (let index = 0; index < data.businessDto.length; index++) {
                        this.options.push({ label: data.businessDto[index].name, value: data.businessDto[index].id });
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
        this.selectionChargeType = value;
    }
    onChange(): void {
        this.zone.run(() => {
            this.propagateChange(this.selectionChargeType);
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
