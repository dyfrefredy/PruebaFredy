import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { CommonModule } from '@angular/common';

import { UIModule } from '../../ui.module';
import { CBPRoutingModule } from './CBP-routing.module';
import { SearchFileComponent } from './search-file/search-file.component';
import { UploadFileComponent } from './upload-file/upload-file.component';


@NgModule({
  imports: [
    FormsModule,
    UIModule,
    CBPRoutingModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule
  ],
  declarations: [
    SearchFileComponent,
    UploadFileComponent
  ]
})
export class CBPModule { }
