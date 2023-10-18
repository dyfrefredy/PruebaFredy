import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { ExternalUser } from '../../../model/external-user';
import { ExternalUserApproval } from '../../../model/external-user-approval';
import { FilterQuery } from '../../../model/filter-query';
import { OrderTable } from '../../../model/order-table';
import { Pagination } from '../../../model/pagination';
import { Station } from '../../../model/station';
import { User } from '../../../model/user';
import { UserCtsDetail } from '../../../model/user-cts-detail';
import { UserStation } from '../../../model/user-station';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  templateUrl: './external-user-approval.component.html',
  styleUrls: ['./external-user-approval.component.scss']
})

export class ExternalUserApprovalComponent implements OnInit {
  externalUserDialog: boolean;
  submitted: boolean;
  loading: boolean;
  externalUserForm: FormGroup;
  externalUsers: ExternalUser[];
  externalUser: ExternalUser;
  externalUserFind: ExternalUser;
  selectedExternalUsers: ExternalUser[];
  formUser: FormGroup;
  pagination: Pagination;
  externalCustomerId: number;
  externalUserApproval: ExternalUserApproval;
  user: User;

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
    private authService: AuthService
  ) {
    this.externalUserForm = this.fb.group({
      companyName: [''],
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
      email: ['', Validators.required],
      fax: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      roleId: ['', Validators.required],
      termsConditions: ['', Validators.required],
      userStations: [''],
      active: [false]
    });

    this.getCountry();
    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.externalUserFind = new ExternalUser();
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.externalCustomerId = 4;
    this.selectionstationsAvailable = new Station();
  }

  get f() {
    return this.externalUserForm.controls;
  }

  loadExternalUsers(event: LazyLoadEvent) {
    this.loading = true;
    this.pagination.pageSize = event.rows;
    this.pagination.pageNo = event.first / event.rows;
    this.pagination.orderTable = [];

    //Para conocer los campos por los cuales se va a filtrar
    if (event.sortField != undefined) {
      let orderTable = new OrderTable();
      orderTable.sorterField = event.sortField;
      orderTable.sorterMode = event.sortOrder === -1 ? 0 : event.sortOrder;
      this.pagination.orderTable.push(orderTable);
    }

    this.getPaginationAndFilter();
    this.loading = false;
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();
    filter = {
      filterDto: this.externalUserFind,
      paginationDto: this.pagination,
    };

    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, this.constantService.EXTERNAL_USER_URL, filter)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.externalUsers = data.businessDto;
            this.totalRecords = data.totalRecords;
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Fecha',
              detail: data.responseDto.message,
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Por favor, intente nuevamente.',
            detail: 'Por favor, intente más tarde.',
          });
        }
      );
  }

  editMember(memberInfo: any) {
    this.externalUser = { ...memberInfo };
    this.selectedStations = [];
    this.getStates(memberInfo.countryId, 2);
    if (memberInfo.stateId) this.getCities(memberInfo.stateId, 2);
    this.externalUserDialog = true;
  }

  getCountry() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.COUNTRY_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.countries = new Array();
          this.countries.push({ label: 'Seleccione País', value: 0 });
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
            this.statesFind.push({ label: 'Seleccione departamento', value: "" });
            for (let index = 0; index < data.businessDto.length; index++) {
              this.statesFind.push({ label: data.businessDto[index].stateName, value: data.businessDto[index].id });
            }
          } else {
            this.states = new Array();
            this.states.push({ label: 'Seleccione departamento', value: "" });
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
            this.citiesFind.push({ label: 'Seleccione ciudad', value: '' });
            for (let index = 0; index < data.businessDto.length; index++) {
              this.citiesFind.push({ label: data.businessDto[index].cityName, value: data.businessDto[index].id });
            }
          } else {
            this.cities = new Array();
            this.cities.push({ label: 'Seleccione ciudad', value: '' });
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

  hideDialog() {
    this.externalUserDialog = false;
    this.submitted = false;
  }

  approval(answer: boolean) {
    this.loading = true;

    this.externalUserApproval = new ExternalUserApproval();
    this.externalUserApproval.email = this.externalUser.email;
    this.externalUserApproval.creationUserId = this.user.id;

    if (answer == true) {
      this.externalUserApproval.responseStatus = true;
      this.externalUserApproval.comments = "El usuario ha sido aprobado";
    } else {
      this.externalUserApproval.responseStatus = false;
      this.externalUserApproval.comments = "El cliente ha sido rechazado";
    }

    this.transactionService.save(environment.adminAPI, this.constantService.EXTERNAL_USER_APPROVAL_URL, this.externalUserApproval).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.hideDialog();

          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
          this.getPaginationAndFilter();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Usuario',
            detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
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
}
