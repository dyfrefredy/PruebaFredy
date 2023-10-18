import { Skychain } from './../../../model/skychain';
import { MasterGuide } from './../../../model/master-guide';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { TransactionService } from '../../../services/transaction.service';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-guide-master',
  templateUrl: './guide-master.component.html',
  styleUrls: ['./guide-master.component.css']
})
export class GuideMasterComponent implements OnInit {
  masterGuide: MasterGuide;
  options: Array<{ label: string; value: any }>;
  items: MenuItem[];
  submitted: boolean;
  activeIndex: number;
  guideMasterHeaderForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private transactionService: TransactionService, private constantService: ConstantService) {
    this.guideMasterHeaderForm = this.fb.group({
      flightDate: ['', Validators.required],
      airlineId: ['', Validators.required],
      flightNumber: ['', Validators.required],
      skychainId: ['', Validators.required],
    });
    this.masterGuide = new MasterGuide();
    this.options = new Array();
    this.options.push({ label: 'Seleccione guía master Skychain', value: 0 });
  }

  get f() {
    return this.guideMasterHeaderForm.controls;
  }

  getSkychain() {
    if (this.f.flightDate && this.f.airlineId && this.f.flightNumber && this.f.airlineId.value !== 0 && this.f.flightNumber.value !== 0) {
      this.transactionService.GetList(environment.adminAPI, this.constantService.SKYCHAIN_URL, '/' + this.f.flightDate.value.toISOString() + '/' + this.f.airlineId.value + '/' + this.f.flightNumber.value).subscribe(
        (data) => {
          this.options = new Array();
          this.options.push({ label: 'Seleccione guía master Skychain', value: 0 });
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            for (let index = 0; index < data.businessDto.length; index++) {
              this.options.push({ label: data.businessDto[index].awb, value: data.businessDto[index].id });
            }
          }
        },
        (error) => {
          console.log('Error: ' + error);
        }
      );
    }
  }

  ngOnInit(): void {
    this.items = [{
                    label: 'Detalle',
                  },
                  {
                      label: 'Remitente'
                  },
                  {
                      label: 'Transportador'
                  },
                  {
                      label: 'Consignatario'
                  },
                  {
                      label: 'Destino'
                  },
                  {
                      label: 'Carga'
                  },
                  {
                      label: 'Confirmación'
                  }];
    this.submitted = false;
    this.activeIndex = 0;
  }



  nextPage() {
    this.activeIndex = this.activeIndex + 1;
    this.submitted = true;
    return;
  }
  prevPage(){
    this.activeIndex = this.activeIndex - 1;
    this.submitted = true;
    return;
  }
}
