import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvInputTextComponent } from './av-input-text/av-input-text.component';
import { AvInputNumberComponent } from './av-input-number/av-input-number.component';
import { AvInputDateComponent } from './av-input-date/av-input-date.component';
import { AvCheckboxComponent } from './av-checkbox/av-checkbox.component';
import { AvButtonComponent } from './av-button/av-button.component';
import { AvSelectComponent } from './av-select/av-select.component';
import { AvListboxComponent } from './av-listbox/av-listbox.component';
import { AvAirlineComponent } from './av-airline/av-airline.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { InputTextModule } from 'primeng/inputtext';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DropdownModule } from 'primeng/dropdown';
import { FieldsetModule } from 'primeng/fieldset';
import { AvStationComponent } from './av-station/av-station.component';
import { AvRoleComponent } from './av-role/av-role.component';
import { AvSkychainComponent } from './av-skychain/av-skychain.component';
import { AvTravelDocumentTypeComponent } from './av-travel-document-type/av-travel-document-type.component';
import { AvAirportComponent } from './av-airport/av-airport.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { AvCountryComponent } from './av-country/av-country.component';
import { AvDocumentTypeComponent } from './av-document-type/av-document-type.component';
import { AvCustomerTypeComponent } from './av-customer-type/av-customer-type.component';
import { AvMeasurementUnitTypeComponent } from './av-measurement-unit-type/av-measurement-unit-type.component';
import { AvWeightUnitTypeComponent } from './av-weight-unit-type/av-weight-unit-type.component';
import { AvCityComponent } from './av-city/av-city.component';
import { AvItineraryCategoryTypeComponent } from './av-itinerary-category-type/av-itinerary-category-type.component';
import { RadioButtonModule } from 'primeng/radiobutton';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { AvInputTextAreaComponent } from './av-input-text-area/av-input-text-area.component';
import { AvLoadTypeComponent } from './av-load-type/av-load-type.component';
import { AvProjectTypeComponent } from './av-project-type/av-project-type.component';
import { AvModuleComponent } from './av-module/av-module.component';
import { AvStationUserComponent } from './av-station-user/av-station-user.component';
import { AvUserTypeComponent } from './av-user-type/av-user-type.component';
import { AvCommoditiesComponent } from './av-commodities/av-commodities.component';
import { AvActiveStationComponent } from './av-active-station/av-active-station.component';
import { AvClaimReasonComponent } from './av-claim-reason/av-claim-reason.component';
import { SelectButtonModule } from 'primeng/selectbutton';
import { AvClaimReasonListComponent } from './av-claim-reason-list/av-claim-reason-list.component';
import { AvSpecialServiceTypeComponent } from './av-special-service-type/av-special-service-type.component';
import { AvSpecialServiceStateComponent } from './av-special-service-state/av-special-service-state.component';
import { AvCityAutoCompleteComponent } from './av-city-autocomplete/av-city-autocomplete.component';
import { AvStationAutocompleteComponent } from './av-station-autocomplete/av-station-autocomplete.component';
import { ListboxModule } from 'primeng/listbox';
import { DataViewModule } from 'primeng/dataview';
import { BreadcrumbComponent } from './breadcrumb/breadcrumb.component';
import { AvContainerTypeComponent } from './av-container-type/av-container-type.component';
import { AvShipmentTypeComponent } from './av-shipment-type/av-shipment-type.component';
import { AvUserAutoCompleteComponent } from './av-user-autocomplete/av-user-autocomplete.component';
import { AvAwbAutocompleteComponent } from './av-awb-autocomplete/av-awb-autocomplete.component';
import { MultiSelectModule } from 'primeng/multiselect';
import { AvLanguageComponent } from './av-language/av-language.component';
import { AvNotificationTypeComponent } from './av-notification-type/av-notification-type.component';
import { AvEscalationLevelComponent } from './av-escalation-level/av-escalation-level.component';
import { AvStationsComponent } from './av-stations/av-stations.component';
import { AvUserComponent } from './av-user/av-user.component';
import { AvUserMultipleAutocompleteComponent } from './av-user-multiple-autocomplete/av-user-multiple-autocomplete.component';
import { AvCompanyTypeComponent } from './av-company-type/av-company-type.component';
import { AvPaymentModeComponent } from './av-payment-mode/av-payment-mode.component';
import { AvShipperUserComponent } from './av-shipper-user/av-shipper-user.component';
import { AvConsigneeUserComponent } from './av-consignee-user/av-consignee-user.component';
import { AvQuotationComponent } from './av-quotation/av-quotation.component';
import { AvInputRangeDateComponent } from './av-input-range-date/av-input-range-date.component';
import { AvAircraftTypeComponent } from './av-aircraft-type/av-aircraft-type.component';
import { AvCargoStackableComponent } from './av-cargo-stackable/av-cargo-stackable.component';
import { AvUserCustomerServiceComponent } from './av-user-customer-service/av-user-customer-service.component';
import { AvQuotationRejectedComponent } from './av-quotation-rejected/av-quotation-rejected.component';
import { AvCommoditiesListComponent } from './av-commodities-list/av-commodities-list.component';
import { AvCountryCodeComponent } from './av-country-code/av-country-code.component';
import { AvYesNoComponent } from './av-yes-no/av-yes-no.component';
import { AvTemperatureRangeComponent } from './av-temperature-range/av-temperature-range.component';
import { AvPackingTypeComponent } from './av-packing-type/av-packing-type.component';
import { AvRepositioningRequiredComponent } from './av-repositioning-required/av-repositioning-required.component';
import { AvClaimStatusComponent } from './av-claim-status/av-claim-status.component';
import { AvGroupAssignmentComponent } from './av-group-assignment/av-group-assignment.component';
import { AvFileTypeComponent } from './av-file-type/av-file-type.component';
import { AvCompanyComponent } from './av-company/av-company.component';
import { AvCompanyDdlComponent } from './av-company-ddl/av-company-ddl.component';

@NgModule({
  declarations: [
    AvInputTextComponent,
    AvInputNumberComponent,
    AvInputDateComponent,
    AvCheckboxComponent,
    AvButtonComponent,
    AvSelectComponent,
    AvListboxComponent,
    AvAirlineComponent,
    AvStationComponent,
    AvRoleComponent,
    AvSkychainComponent,
    AvTravelDocumentTypeComponent,
    AvAirportComponent,
    AvCountryComponent,
    AvDocumentTypeComponent,
    AvCustomerTypeComponent,
    AvMeasurementUnitTypeComponent,
    AvWeightUnitTypeComponent,
    AvCityComponent,
    AvItineraryCategoryTypeComponent,
    AvInputTextAreaComponent,
    AvLoadTypeComponent,
    AvContainerTypeComponent,
    AvShipmentTypeComponent,
    AvProjectTypeComponent,
    AvModuleComponent,
    AvStationUserComponent,
    AvUserTypeComponent,
    AvCommoditiesComponent,
    AvActiveStationComponent,
    AvClaimReasonComponent,
    AvClaimReasonListComponent,
    AvSpecialServiceTypeComponent,
    AvSpecialServiceStateComponent,
    AvCityAutoCompleteComponent,
    AvStationAutocompleteComponent,
    BreadcrumbComponent,
    AvUserAutoCompleteComponent,
    AvAwbAutocompleteComponent,
    AvLanguageComponent,
    AvNotificationTypeComponent,
    AvEscalationLevelComponent,
    AvStationsComponent,
    AvInputTextComponent,
    AvInputNumberComponent,
    AvInputDateComponent,
    AvCheckboxComponent,
    AvButtonComponent,
    AvSelectComponent,
    AvListboxComponent,
    AvAirlineComponent,
    AvStationComponent,
    AvRoleComponent,
    AvSkychainComponent,
    AvTravelDocumentTypeComponent,
    AvAirportComponent,
    AvCountryComponent,
    AvDocumentTypeComponent,
    AvCustomerTypeComponent,
    AvMeasurementUnitTypeComponent,
    AvWeightUnitTypeComponent,
    AvCityComponent,
    AvItineraryCategoryTypeComponent,
    AvInputTextAreaComponent,
    AvLoadTypeComponent,
    AvContainerTypeComponent,
    AvShipmentTypeComponent,
    AvProjectTypeComponent,
    AvModuleComponent,
    AvStationUserComponent,
    AvUserTypeComponent,
    AvSpecialServiceTypeComponent,
    AvSpecialServiceStateComponent,
    AvCityAutoCompleteComponent,
    AvStationAutocompleteComponent,
    BreadcrumbComponent,
    AvUserAutoCompleteComponent,
    AvAwbAutocompleteComponent,
    AvUserComponent,
    AvUserMultipleAutocompleteComponent,
    AvCompanyTypeComponent,
    AvPaymentModeComponent,
    AvShipperUserComponent,
    AvConsigneeUserComponent,
    AvQuotationComponent,
    AvInputRangeDateComponent,
    AvCommoditiesListComponent,
    AvCountryCodeComponent,
    AvAircraftTypeComponent,
    AvCargoStackableComponent,
    AvUserCustomerServiceComponent,
    AvQuotationRejectedComponent,
    AvYesNoComponent,
    AvTemperatureRangeComponent,
    AvPackingTypeComponent,
    AvRepositioningRequiredComponent,
    AvClaimStatusComponent,
    AvClaimStatusComponent,
    AvGroupAssignmentComponent,
    AvFileTypeComponent,
    AvCompanyComponent,
    AvCompanyDdlComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    ListboxModule,
    DropdownModule,
    FieldsetModule,
    AutoCompleteModule,
    RadioButtonModule,
    InputTextareaModule,
    SelectButtonModule,
    DataViewModule,
    MultiSelectModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    InputTextModule,
    CalendarModule,
    CheckboxModule,
    ListboxModule,
    DropdownModule,
    FieldsetModule,
    AutoCompleteModule,
    RadioButtonModule,
    InputTextareaModule,
    DataViewModule,
  ],
  exports: [
    AvInputTextComponent,
    AvInputNumberComponent,
    AvInputDateComponent,
    AvCheckboxComponent,
    AvButtonComponent,
    AvSelectComponent,
    AvListboxComponent,
    AvAirlineComponent,
    AvStationComponent,
    AvRoleComponent,
    AvSkychainComponent,
    AvTravelDocumentTypeComponent,
    AvAirportComponent,
    AvCountryComponent,
    AvDocumentTypeComponent,
    AvCustomerTypeComponent,
    AvMeasurementUnitTypeComponent,
    AvWeightUnitTypeComponent,
    AvCityComponent,
    AvItineraryCategoryTypeComponent,
    AvInputTextAreaComponent,
    AvLoadTypeComponent,
    AvContainerTypeComponent,
    AvShipmentTypeComponent,
    AvProjectTypeComponent,
    AvModuleComponent,
    AvStationUserComponent,
    AvUserTypeComponent,
    AvCommoditiesComponent,
    AvActiveStationComponent,
    AvClaimReasonComponent,
    AvClaimReasonListComponent,
    AvSpecialServiceTypeComponent,
    AvSpecialServiceStateComponent,
    AvCityAutoCompleteComponent,
    AvStationAutocompleteComponent,
    BreadcrumbComponent,
    AvUserAutoCompleteComponent,
    AvAwbAutocompleteComponent,
    AvLanguageComponent,
    AvNotificationTypeComponent,
    AvEscalationLevelComponent,
    AvStationsComponent,
    AvInputTextComponent,
    AvInputNumberComponent,
    AvInputDateComponent,
    AvCheckboxComponent,
    AvButtonComponent,
    AvSelectComponent,
    AvListboxComponent,
    AvAirlineComponent,
    AvStationComponent,
    AvRoleComponent,
    AvSkychainComponent,
    AvTravelDocumentTypeComponent,
    AvAirportComponent,
    AvCountryComponent,
    AvDocumentTypeComponent,
    AvCustomerTypeComponent,
    AvMeasurementUnitTypeComponent,
    AvWeightUnitTypeComponent,
    AvCityComponent,
    AvItineraryCategoryTypeComponent,
    AvInputTextAreaComponent,
    AvLoadTypeComponent,
    AvContainerTypeComponent,
    AvShipmentTypeComponent,
    AvProjectTypeComponent,
    AvModuleComponent,
    AvStationUserComponent,
    AvUserTypeComponent,
    AvSpecialServiceTypeComponent,
    AvSpecialServiceStateComponent,
    AvCityAutoCompleteComponent,
    AvStationAutocompleteComponent,
    BreadcrumbComponent,
    AvUserAutoCompleteComponent,
    AvAwbAutocompleteComponent,
    AvUserComponent,
    AvUserMultipleAutocompleteComponent,
    AvPaymentModeComponent,
    AvShipperUserComponent,
    AvConsigneeUserComponent,
    AvQuotationComponent,
    AvInputRangeDateComponent,
    AvCompanyTypeComponent,
    AvCommoditiesListComponent,
    AvCountryCodeComponent,
    AvAircraftTypeComponent,
    AvCargoStackableComponent,
    AvUserCustomerServiceComponent,
    AvQuotationRejectedComponent,
    AvYesNoComponent,
    AvTemperatureRangeComponent,
    AvPackingTypeComponent,
    AvRepositioningRequiredComponent,
    AvClaimStatusComponent,
    AvClaimStatusComponent,
    AvGroupAssignmentComponent,
    AvFileTypeComponent,
    AvCompanyComponent,
    AvCompanyDdlComponent
  ],
})

export class AvComponentsModule { }
