import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ConstantService } from '../../../constant/constant-service';
import { MessageService, ConfirmationService, LazyLoadEvent } from 'primeng/api';
import { TransactionService } from '../../../services/transaction.service';
import { FilterQuery } from '../../../model/filter-query';
import { Pagination } from '../../../model/pagination';
import { OrderTable } from '../../../model/order-table';
import { environment } from '../../../../environments/environment';
import { DryIceSupply } from '../../../model/dry-ice-supply';
import { Station } from '../../../model/station';
import { UserCapacity } from '../../../model/user-capacity';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-user-capacity',
  templateUrl: './user-capacity.component.html',
  styleUrls: ['./user-capacity.component.css']
})
export class UserCapacityComponent implements OnInit {


  rowGroupMetadata: any;

  userCapacityDialog: boolean;
  submitted: boolean;
  loading: boolean;
  userCapacityForm: FormGroup;
  usercapacities: UserCapacity[];
  saveCapacities: UserCapacity[];
  saveCapacity: UserCapacity;
  userCapacity: UserCapacity;
  userCapacityFind: UserCapacity;
  userCapacityEdit: UserCapacity;
  selectedDryIceSupplys: DryIceSupply[];
  selectedStations: Station[];
  selectedUsers: User[];
  selectionstationsAvailable: Station;
  selectionUsersAvailable: User[];
  control: FormControl;
  station: Station;
  stationDestination: Station;
  user: User[];
  userCreated: User;
  userEdit: User;

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private authService: AuthService
  ) {
    this.userCreated = this.authService.currentUserValue;
    this.userCapacityForm = this.fb.group({
      userName: [''],
      originStation: ['', Validators.required],
      active: ['', Validators.required],
      allDestination: ['', Validators.required],
      destinationStations: ['']
    });
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.userEdit = new User();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;
    this.userCapacityFind = new UserCapacity();
    this.userCapacityEdit = new UserCapacity();
    this.userCapacity = new UserCapacity();
    this.selectedStations = [];
    this.selectedUsers = [];
    this.selectionstationsAvailable = new Station();
    this.selectionUsersAvailable = [];
    this.station = new Station();
    this.saveCapacities = [];
    this.user = [];
    this.stationDestination = new Station();
    this.userCapacity.active = true;
  }

  get f() {
    return this.userCapacityForm.controls;
  }

  openNew() {
    this.saveCapacities = [];
    this.userCapacity = new UserCapacity();
    this.userCapacity.id = 0;
    this.station = new Station();
    this.user = [];
    this.selectedStations = [];
    this.selectedUsers = [];
    this.submitted = false;
    this.userCapacityDialog = true;
  }

  hideDialog() {
    this.userCapacityDialog = false;
    this.submitted = false;
  }

  editUserCapacity(editUserCapacity) {
    this.saveCapacities = [];
    this.userCapacityEdit = new UserCapacity();
    this.userCapacity = { ...editUserCapacity };
    this.selectedStations = [];
    this.selectedUsers = [];
    this.userEdit = this.userCapacity.user;
    this.station = this.userCapacity.orgStation;
    //this.stationDestination = this.userCapacity.destStation;
    this.user = [];

    this.userCapacityEdit.originStationId = this.userCapacity.originStationId;
    this.userCapacityEdit.userId = this.userCapacity.user.id;
    this.getPaginationAndFilterStation();

    this.userCapacityDialog = true;
  }

  saveUserCapacity() {
    this.submitted = true;
    this.loading = true;

    if (this.userCapacityForm.invalid && !this.station && !this.user) {
      this.loading = false;
      return;
    }

    if (this.userCapacity.id) {

      this.selectedStations.forEach(item => {
        this.saveCapacity = new UserCapacity();
        this.saveCapacity.createdUserId = this.userCreated.id;
        this.saveCapacity.userId = this.userCapacity.userId;
        this.saveCapacity.originStationId = this.station.id;
        this.saveCapacity.destinationStationId = item.id;
        this.saveCapacity.active = this.userCapacity.active;
        this.saveCapacity.allDestination = this.userCapacity.allDestination;
        this.saveCapacities.push(this.saveCapacity);
      });


      this.transactionService.update(environment.adminAPI, this.constantService.USER_CAPACITY, this.saveCapacities).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.userCapacityForm.reset(
              {
                Name: null,
                description: null,
                baseAdmonCod: null,
                acive: null,
              },
              { onlySelf: false, emitEvent: false }
            );
            this.submitted = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Reabastecimiento de hielo seco',
              detail: data.responseDto.message
            });
            this.getPaginationAndFilter();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Reabastecimiento de hielo seco',
              detail:
                data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Reabastecimiento de hielo seco',
            detail: 'Por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      );
    } else {
      if (this.userCapacity.allDestination) {
        this.selectedUsers.forEach(user => {
          this.saveCapacity = new UserCapacity();
          this.saveCapacity.userId = user.id;
          this.saveCapacity.originStationId = this.station.id;
          this.saveCapacity.active = this.userCapacity.active;
          this.saveCapacity.allDestination = this.userCapacity.allDestination;
          this.saveCapacities.push(this.saveCapacity);
        });

      } else {
        this.selectedUsers.forEach(user => {
          this.selectedStations.forEach(item => {
            this.saveCapacity = new UserCapacity();
            this.saveCapacity.createdUserId = this.userCreated.id;
            this.saveCapacity.userId = user.id;
            this.saveCapacity.originStationId = this.station.id;
            this.saveCapacity.destinationStationId = item.id;
            this.saveCapacity.active = this.userCapacity.active;
            this.saveCapacities.push(this.saveCapacity);
          });
        });
      }

      this.transactionService.save(environment.adminAPI, this.constantService.USER_CAPACITY, this.saveCapacities).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.userCapacityForm.reset(
              { onlySelf: false, emitEvent: false }
            );

            this.messageService.add({
              severity: 'success',
              summary: 'Reabastecimiento de hielo seco',
              detail: data.responseDto.message,
            });
            this.getPaginationAndFilter();
          } else {
            this.messageService.add({
              severity: 'warn',
              summary: 'Reabastecimiento de hielo seco',
              detail:
                data.responseDto.message + ' , por favor inténtelo de nuevo!',
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Reabastecimiento de hielo seco',
            detail: 'Por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      );
    }
    this.hideDialog();
    this.loading = false;
  }

  // deleteSelectedDryIceSupplys() {
  //   if (this.selectedDryIceSupplys || this.selectedDryIceSupplys.length) {
  //     this.confirmationService.confirm({
  //       message: '¿Está seguro de que desea inactivar los reabastecimientos seleccionados?',
  //       header: 'Confirmación',
  //       icon: 'pi pi-exclamation-triangle',
  //       accept: () => {
  //         let ids = [];
  //         this.selectedDryIceSupplys.forEach(function (value) {
  //           ids.push(value.id);
  //         });

  //         this.transactionService
  //           .delete(environment.adminAPI, this.constantService.DRY_ICE_SUPPLY_URL, ids)
  //           .subscribe(
  //             (data) => {
  //               if (
  //                 data.responseDto.response === this.constantService.RESPONSE_OK
  //               ) {
  //                 this.messageService.add({
  //                   severity: 'success',
  //                   summary: 'Reabastecimiento de hielo seco',
  //                   detail: data.responseDto.message,
  //                   life: 3000,
  //                 });
  //                 this.getPaginationAndFilter();
  //               } else {
  //                 this.messageService.add({
  //                   severity: 'warn',
  //                   summary: 'Reabastecimiento de hielo seco',
  //                   detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
  //                   life: 8000,
  //                 });
  //               }
  //             },
  //             (error) => {
  //               this.loading = false;
  //               this.messageService.add({
  //                 severity: 'error',
  //                 summary: 'Reabastecimiento de hielo seco',
  //                 detail: 'Por favor, intente más tarde.',
  //               });
  //             }
  //           );
  //         this.selectedDryIceSupplys = null;
  //       },
  //     });
  //   }
  // }

  // deleteDryIceSupply(dryIceSupply: DryIceSupply) {
  //   this.confirmationService.confirm({
  //     message: '¿Está seguro de que desea inactivar el reabastecimiento de hielo seco?',
  //     header: 'Confirmar',
  //     icon: 'pi pi-exclamation-triangle',
  //     accept: () => {
  //       let ids = [];
  //       ids.push(dryIceSupply.id);

  //       this.transactionService
  //         .delete(environment.adminAPI, this.constantService.DRY_ICE_SUPPLY_URL, ids)
  //         .subscribe((data) => {
  //           if (
  //             data.responseDto.response === this.constantService.RESPONSE_OK
  //           ) {
  //             this.messageService.add({
  //               severity: 'success',
  //               summary: 'Reabastecimiento de hielo seco',
  //               detail: data.responseDto.message,
  //               life: 3000,
  //             });
  //             this.getPaginationAndFilter();
  //           } else {
  //             this.messageService.add({
  //               severity: 'warn',
  //               summary: 'Reabastecimiento de hielo seco',
  //               detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
  //               life: 8000,
  //             });
  //           }
  //         },
  //           (error) => {
  //             this.loading = false;
  //             this.messageService.add({
  //               severity: 'error',
  //               summary: 'Reabastecimiento de hielo seco',
  //               detail: 'Por favor, intente más tarde.',
  //             });
  //           }
  //         );
  //     },
  //   });
  // }


  getPaginationAndFilter() {

    let filter = new FilterQuery();

    filter = {
      filterDto: this.userCapacityFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.USER_CAPACITY, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.usercapacities = data.businessDto;
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

  loadDryIceSupplys(event: LazyLoadEvent) {
    this.loading = true;
    this.pagination.pageSize = event.rows;
    this.pagination.pageNo = (event.first / event.rows);
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

  getPaginationAndFilterStation() {

    let filter = new FilterQuery();

    filter = {
      filterDto: this.userCapacityEdit,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.USER_CAPACITY, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          data.businessDto.forEach(item => {
            this.selectedStations.push(item.destStation);
          });
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


}
