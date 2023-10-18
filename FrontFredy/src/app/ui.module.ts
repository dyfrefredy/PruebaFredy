import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CardModule } from 'primeng/card';
import { CommonModule } from '@angular/common';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { NgModule } from '@angular/core';
import { PanelMenuModule } from 'primeng/panelmenu';
import { PanelModule } from 'primeng/panel';
import { TableModule } from 'primeng/table';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { TranslateModule } from '@ngx-translate/core';
import { FieldsetModule } from 'primeng/fieldset';
import { RadioButtonModule } from 'primeng/radiobutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AvComponentsModule } from './components/av-components.module';
import { DropdownModule } from 'primeng/dropdown';
import { MessageService, ConfirmationService, SharedModule } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TriStateCheckboxModule } from 'primeng/tristatecheckbox';
import { BlockUIModule } from 'primeng/blockui';
import { StepsModule } from 'primeng/steps';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MessagesModule } from 'primeng/messages';
import { ListboxModule } from 'primeng/listbox';
import { ChartModule } from 'primeng/chart';
import {AccordionModule} from 'primeng/accordion';
import {SelectButtonModule} from 'primeng/selectbutton';
import {TooltipModule} from 'primeng/tooltip';
import {TimelineModule} from 'primeng/timeline';
import { DataViewModule } from 'primeng/dataview';
import { AvDateTimeOffsetPipe } from './pipes/av-date-time-offset.pipe';
import {ChipsModule} from 'primeng/chips';


@NgModule({
  declarations: [
    AvDateTimeOffsetPipe
  ],
  imports: [
    CommonModule,
    SharedModule,

  ],
  exports: [
    ButtonModule,
    CalendarModule,
    CardModule,
    FileUploadModule,
    InputTextModule,
    MenuModule,
    MessageModule,
    MultiSelectModule,
    PanelMenuModule,
    PanelModule,
    TableModule,
    TabViewModule,
    ToolbarModule,
    TranslateModule,
    FieldsetModule,
    CheckboxModule,
    RadioButtonModule,
    ScrollPanelModule,
    OverlayPanelModule,
    ReactiveFormsModule,
    FormsModule,
    AvComponentsModule,
    DropdownModule,
    ToastModule,
    DialogModule,
    ConfirmDialogModule,
    ProgressSpinnerModule,
    TriStateCheckboxModule,
    BlockUIModule,
    StepsModule,
    AutoCompleteModule,
    MessagesModule,
    ListboxModule,
    ChartModule,
    AccordionModule,
    SelectButtonModule,
    TooltipModule,
    TimelineModule,
    DataViewModule,
    AvDateTimeOffsetPipe,
    MultiSelectModule,
    ChipsModule
  ],
  providers: [ MessageService, ConfirmationService ],
})
export class UIModule { }
