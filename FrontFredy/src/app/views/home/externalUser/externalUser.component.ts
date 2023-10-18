import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { FilterQuery } from '../../../model/filter-query';
import { OrderTable } from '../../../model/order-table';
import { Pagination } from '../../../model/pagination';
import { Station } from '../../../model/station';
import { ExternalUser } from '../../../model/external-user';
import { TransactionService } from '../../../services/transaction.service';
import { Router } from '@angular/router';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { TranslateService } from '@ngx-translate/core';


@Component({
  templateUrl: './externalUser.component.html',
  styleUrls: ['./externalUser.component.scss']
})

export class ExternalUserComponent implements OnInit {
  externalUserDialog: boolean;
  submitted: boolean;
  loading: boolean;
  externalUserForm: FormGroup;
  externalUser: ExternalUser;
  externalUserFind: ExternalUser;
  selectedExternalUsers: ExternalUser[];
  formExternalUser: FormGroup;
  pagination: Pagination;
  externalCustomerId: number;
  user: any;
  warningDialog: boolean = false;

  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  countries: Array<{ label: string; value: any }>;
  states: Array<{ label: string; value: any }>;
  statesFind: Array<{ label: string; value: any }>;
  cities: Array<{ label: string; value: any }>;
  citiesFind: Array<{ label: string; value: any }>;
  selectionstationsAvailable: Station;
  selectedStations: Station[];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private route: Router,
    private authService: AuthService,
    private translateService: TranslateService
  ) {
    this.externalUserForm = this.fb.group({
      companyName: ['', Validators.required],
      companyTypeId: ['', Validators.required],
      iataCode: [''],
      cassCode: [''],
      address: [''],
      countryId: ['', Validators.required],
      stateId: [''],
      cityId: [''],
      postalCode: [''],
      phoneNumber: [''],
      mobileNumber: [''],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      fax: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      termsConditions: ['', Validators.required],
      externalUserStations: [''],
      active: [false]
    });

    this.getCountry();
    this.user = this.authService.getAccount();
  }

  ngOnInit(): void {
    this.externalUserFind = new ExternalUser();
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.externalCustomerId = 4;
    this.selectionstationsAvailable = new Station();
    this.externalUser = new ExternalUser();
    this.externalUser.email = this.user.idToken.emails[0];
  }

  get f() {
    return this.externalUserForm.controls;
  }
  
  getCountry() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.COUNTRY_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.countries = new Array();
          this.countries.push({ label: this.translateService.instant('module.componentNames.select', "select"), value: 0 });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.countries.push({ label: data.businessDto[index].countryName, value: data.businessDto[index].id });
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  onChangeCountry(opc: number): void {
    //opc 1: Filtro, 2: Formulario
    if (opc == 1) {
      this.getStates(this.externalUserFind.countryId, 1)
    } else {
      this.getStates(this.externalUser.countryId, 2)
    }
  }

  getStates(countryId: number, opc: number) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.STATE_URL, '/GetStatesCountry/' + countryId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          //opc 1: Filtro, 2: Formulario
          if (opc == 1) {
            this.statesFind = new Array();
            this.statesFind.push({ label: this.translateService.instant('module.componentNames.select', "select"), value: 0 });
            for (let index = 0; index < data.businessDto.length; index++) {
              this.statesFind.push({ label: data.businessDto[index].stateName, value: data.businessDto[index].id });
            }
          } else {
            this.states = new Array();
            this.states.push({ label: this.translateService.instant('module.componentNames.select', "select"), value: 0 });
            for (let index = 0; index < data.businessDto.length; index++) {
              this.states.push({ label: data.businessDto[index].stateName, value: data.businessDto[index].id });
            }
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  onChangeState(opc: number): void {
    //opc 1: Filtro, 2: Formulario
    if (opc == 1) {
      this.getCities(this.externalUserFind.stateId, 1)
    } else {
      this.getCities(this.externalUser.stateId, 2)
    }
  }

  getCities(stateId: number, opc: number) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.CITY_URL, '/GetCitysState/' + stateId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          //opc 1: Filtro, 2: Formulario
          if (opc == 1) {
            this.citiesFind = new Array();
            this.citiesFind.push({ label: this.translateService.instant('module.componentNames.select', "select"), value: 0 });
            for (let index = 0; index < data.businessDto.length; index++) {
              this.citiesFind.push({ label: data.businessDto[index].cityName, value: data.businessDto[index].id });
            }
          } else {
            this.cities = new Array();
            this.cities.push({ label: this.translateService.instant('module.componentNames.select', "select"), value: 0 });
            for (let index = 0; index < data.businessDto.length; index++) {
              this.cities.push({ label: data.businessDto[index].cityName, value: data.businessDto[index].id });
            }
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  saveExternalUser() {
    this.submitted = true;
    this.loading = true;

    if (this.externalUserForm.invalid || this.externalUser.termsConditions != true) {
      this.loading = false;
      return;
    }

    this.transactionService.save(environment.adminAPI, this.constantService.EXTERNAL_USER_URL, this.externalUser).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.externalUserForm.reset(
            { onlySelf: false, emitEvent: false }
          );
          
          this.externalUser = new ExternalUser();
          this.submitted = false;

          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });

          this.warningDialog = true;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario',
            detail:
              data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Usuario',
          detail: 'Por favor inténtelo de nuevo!',
          life: 8000,
        });
      }
    );

    this.loading = false;
  }

  finalize(){
    this.route.navigate(['home']); 
  }
}
