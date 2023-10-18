import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { UIModule } from '../../ui.module';
import { CommonModule } from '@angular/common';
import { ImportMuiscaComponent } from './import-muisca/import-muisca.component';
import { ImportRoutingModule } from './import-routing.module';
import { ImportSkychainComponent } from './import-skychain/import-skychain.component';
import { ImportDian1166Component } from './import-dian-1166/import-dian-1166.component';

@NgModule({
  imports: [
    FormsModule,
    ImportRoutingModule,
    UIModule,
    ChartsModule,
    BsDropdownModule,
    ButtonsModule.forRoot(),
    CommonModule
  ],
  declarations: [ ImportMuiscaComponent, ImportSkychainComponent, ImportDian1166Component ]
})
export class ImportModule { }
