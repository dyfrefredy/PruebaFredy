import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { UserTypeService } from '../../../enumeration/user-type-service';
import { ExternalUserGroup } from '../../../model/external-user-group';
import { ExternalUserGroupType } from '../../../model/external-user-group-type';
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
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {
  userDialog: boolean;
  submitted: boolean;
  loading: boolean;
  userForm: FormGroup;
  users: User[];
  user: User;
  userFind: User;
  selectedUsers: User[];
  formUser: FormGroup;
  pagination: Pagination;
  externalCustomerId: number;

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
  selectionGroupsAvailable: ExternalUserGroupType;
  selectedGroups: ExternalUserGroupType[];
  userLogin: User;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private userTypeService: UserTypeService,
    private authService: AuthService
  ) {
    this.userForm = this.fb.group({
      companyName: [''],
      companyTypeId: [''],
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
      userTypeId: ['', Validators.required],
      termsConditions: ['', Validators.required],
      userStations: [''],
      active: [false],
      externalUserGroup: ['']
    });

    this.getCountry();
    this.userLogin = this.authService.currentUserValue;
  }

  ngOnInit(): void {
    this.userFind = new User();
    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.externalCustomerId = 4;
    this.selectionstationsAvailable = new Station();
    this.selectionGroupsAvailable = new ExternalUserGroupType();
  }

  get f() {
    return this.userForm.controls;
  }

  loadUsers(event: LazyLoadEvent) {
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
      filterDto: this.userFind,
      paginationDto: this.pagination,
    };

    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, this.constantService.USER_URL, filter)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.users = data.businessDto;
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

  openNew() {
    this.user = new User();
    this.user.userCtsDetail = new UserCtsDetail();
    this.user.id = 0;
    this.selectedStations = [] ;
    this.selectedGroups = [] ;
    this.submitted = false;
    this.userDialog = true;
    this.user.userStation = [];
    this.user.externalUserGroup = [];
    this.getUserStations(this.user.id);
  }

  editMember(memberInfo: any) {
    this.user = { ...memberInfo };
    this.selectedStations = [] ;
    this.selectedGroups = [];
    this.getUserStations(this.user.id);
    this.getExternalUserGroups(this.user.id);
    this.userDialog = true;
    this.getStates(memberInfo.countryId, 2);
    if (memberInfo.stateId) this.getCities(memberInfo.stateId, 2);
    this.getUserCtsDetail(memberInfo.id);
    this.user.userStation = [];
  }

  getUserCtsDetail(userId: number) {
    this.user.userCtsDetail = new UserCtsDetail();

    this.transactionService.GetList(environment.adminAPI, this.constantService.USER_CTS_DETAIL_URL, '/getDetailByUserId/' + userId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          if (data.businessDto.leng > 0)
          this.user.userCtsDetail = data.businessDto[0];
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

  getUserStations(userId:number) {
    this.transactionService.getAll(environment.adminAPI, this.constantService.USER_STATION_URL + "/GetUserStation/" + userId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.selectionstationsAvailable = new Station()
          this.user.userStation = [];
          this.user.userStation = data.businessDto;

          for (let index = 0; index < data.businessDto.length; index++) {
            if (data.businessDto[index].active == true) {
              this.selectedStations.push(data.businessDto[index].station);
            }
          }
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
      this.getStates(this.userFind.countryId, 1)
    } else {
      this.getStates(this.user.countryId, 2)
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
      this.getCities(this.userFind.stateId, 1)
    } else {
      this.getCities(this.user.stateId, 2)
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
    this.userDialog = false;
    this.submitted = false;
  }

  saveUser() {
    this.submitted = true;
    this.loading = true;
    
    if (this.userForm.invalid || this.user.termsConditions != true
        || (this.selectedGroups.length <= 0 && this.user.userTypeId == this.userTypeService.externalCustomer)
    ) {
      this.loading = false;
      return;
    }

    if (this.user.userTypeId != this.externalCustomerId || JSON.stringify(this.user.userCtsDetail)=='{}') {
      this.user.userCtsDetail = null;
    }

    // Validación de grupos de usuarios externos:
    if (this.user.userTypeId == this.userTypeService.externalCustomer) {
      if (this.user.externalUserGroup.length <= 0)
        this.addExternalUserGroup();
      else
        this.editExternalUserGroup();
    }

    if (this.user.id) {
      for (let index = 0; index < this.selectedStations.length; index++) {
        //Agregar estaciones nuevas:
        if (!this.user.userStation.find(f => f.stationId == this.selectedStations[index].id)) {
          this.user.userStation.push({
            id: 0,
            stationId: this.selectedStations[index].id,
            stationName: '',
            stationDesc: '',
            userId: this.user.id,
            active: true,
          })
        }

        //Reactivar estaciones:
        if (this.user.userStation.find(f => f.stationId == this.selectedStations[index].id && f.active == false)) {
          var index2: number = this.user.userStation.indexOf(this.user.userStation.find(f => f.stationId == this.selectedStations[index].id));
          this.user.userStation[index2].active = true;
        }
      }

      //Desactivar estaciones:
      for (let index = 0; index < this.user.userStation.length; index++) {
        if (!this.selectedStations.find(f => f.id == this.user.userStation[index].stationId)) {
          this.user.userStation[index].active = false;
        }
      }

      this.user.userLoginId = this.userLogin.id;

      this.transactionService.update(environment.adminAPI, this.constantService.USER_URL, this.user).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.userForm.reset(
              { onlySelf: false, emitEvent: false }
            );
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
    } else {
      this.user.userStation = [];
      for (let i = 0; i < this.selectedStations.length; i++) {
        var userStation = new UserStation();
        userStation.id = 0;
        userStation.stationId = this.selectedStations[i].id;
        userStation.active = true;
        this.user.userStation.push(userStation);
      }

      this.user.userLoginId = this.userLogin.id;

      this.transactionService.save(environment.adminAPI, this.constantService.USER_URL, this.user).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.userForm.reset(
              { onlySelf: false, emitEvent: false }
            );

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
    }

    this.hideDialog();
    this.loading = false;
  }

  deleteSelectedUsers() {
    if (this.selectedUsers || this.selectedUsers.length) {
      this.confirmationService.confirm({
        message:
          '¿Está seguro de que desea eliminar los Usuarios seleccionados?',
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          let ids = [];
          this.selectedUsers.forEach(function (value) {
            ids.push(value.id);
          });

          this.transactionService
            .delete(environment.adminAPI, this.constantService.USER_URL + '/' + this.userLogin.id, ids)
            .subscribe(
              (data) => {
                if (
                  data.responseDto.response === this.constantService.RESPONSE_OK
                ) {
                  this.messageService.add({
                    severity: 'success',
                    summary: 'Usuario',
                    detail: data.responseDto.message,
                    life: 3000,
                  });
                  this.getPaginationAndFilter();
                } else {
                  this.messageService.add({
                    severity: 'warn',
                    summary: 'Usuario',
                    detail: data.responseDto.message,
                    life: 8000,
                  });
                }
              },
              (error) => {
                this.loading = false;
                this.messageService.add({
                  severity: 'error',
                  summary: 'Usuario',
                  detail: 'Por favor, intente más tarde.',
                });
              }
            );
          this.selectedUsers = null;
        },
      });
    }
  }

  deleteMember(user: User) {
    this.confirmationService.confirm({
      message: '¿Está seguro de que desea eliminar miembro ?',
      header: 'Confirmar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        let ids = [];
        ids.push(user.id);
        this.transactionService
          .delete(environment.adminAPI, this.constantService.USER_URL + '/' + this.userLogin.id, ids)
          .subscribe(
            (data) => {
              if (
                data.responseDto.response === this.constantService.RESPONSE_OK
              ) {
                this.messageService.add({
                  severity: 'success',
                  summary: 'Usuario',
                  detail: data.responseDto.message,
                  life: 8000,
                });
                this.getPaginationAndFilter();
              } else {
                this.messageService.add({
                  severity: 'warn',
                  summary: 'Usuario',
                  detail: data.responseDto.message,
                  life: 8000,
                });
              }
            },
            (error) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Usuario',
                detail: 'Por favor, intente más tarde.',
              });
            }
          );
      },
    });
  }

  addExternalUserGroup() {
    this.user.externalUserGroup = [];

    for (let i = 0; i < this.selectedGroups.length; i++) {
      var externalUserGroup = new ExternalUserGroup();
      externalUserGroup.id = 0;
      externalUserGroup.externalUserGroupTypeId = this.selectedGroups[i].id;
      externalUserGroup.userId = this.user.id;
      externalUserGroup.active = true;
      externalUserGroup.createdUserId = this.userLogin.id;
      this.user.externalUserGroup.push(externalUserGroup);
    }
  }

  editExternalUserGroup() {
    for (let index = 0; index < this.selectedGroups.length; index++) {
      //Agregar grupo nuevo:
      if (!this.user.externalUserGroup.find(f => f.externalUserGroupTypeId == this.selectedGroups[index].id)) {
        this.user.externalUserGroup.push({
          id: 0,
          externalUserGroupTypeId: this.selectedGroups[index].id,
          userId: this.user.id,
          active: true,
          createdUserId: this.userLogin.id,
          updatedUserId: undefined
        })
      }

      //Reactivar grupo:
      if (this.user.externalUserGroup.find(f => f.externalUserGroupTypeId == this.selectedGroups[index].id && f.active == false)) {
        var index2: number = this.user.externalUserGroup.indexOf(this.user.externalUserGroup.find(f => f.externalUserGroupTypeId == this.selectedGroups[index].id));
        this.user.externalUserGroup[index2].active = true;
        this.user.externalUserGroup[index2].updatedUserId = this.userLogin.id;
      }
    }

    //Desactivar grupo:
    for (let index = 0; index < this.user.externalUserGroup.length; index++) {
      if (!this.selectedGroups.find(f => f.id == this.user.externalUserGroup[index].externalUserGroupTypeId)) {
        this.user.externalUserGroup[index].active = false;
        this.user.externalUserGroup[index].updatedUserId = this.userLogin.id;
      }
    }
  }

  getExternalUserGroups(userId: number) {
    this.transactionService.getAll(environment.adminAPI, this.constantService.EXTERNAL_USER_GROUP + "/GetByUserId/" + userId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.selectionGroupsAvailable = new ExternalUserGroupType()
          this.user.externalUserGroup = [];
          this.user.externalUserGroup = data.businessDto;

          for (let index = 0; index < data.businessDto.length; index++) {
            if (data.businessDto[index].active == true) {
              this.selectedGroups.push(data.businessDto[index].externalUserGroupType);
            }
          }
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
}
