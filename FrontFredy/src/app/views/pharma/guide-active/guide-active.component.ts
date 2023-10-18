import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService, LazyLoadEvent, ConfirmationService } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { FilterQuery } from '../../../model/filter-query';
import { PharmaCoolCareView } from '../../../model/pharma-cool-care';
import { Pagination } from '../../../model/pagination';
import { PharmaCare } from '../../../model/pharma-care';
import { TransactionService } from '../../../services/transaction.service';
import { OrderTable } from '../../../model/order-table';
import { GuideActive } from '../../../model/guide-active';
import { AirWaybillSearch } from '../../../model/air-waybill-search';
import { PharmaCoolCareDetail } from '../../../model/pharma-cool-care-detail';
import { WaybillStatus } from '../../../model/waybill-status';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { WaybillRpaDryIceSupply } from '../../../model/waybill-rpa-dry-ice-supply';
import moment from 'moment';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-guide-active',
  templateUrl: './guide-active.component.html',
  styleUrls: ['./guide-active.component.scss']
})

export class GuideActiveComponent implements OnInit {
  @Input() filters: {
    guideActives: GuideActive[],
    airWaybillSearch: AirWaybillSearch
  };
  @Input() totalRecords: number;

  pagination: Pagination;
  loading: boolean;
  submitted: boolean;
  user: User;

  guideActive: GuideActive;
  guideActiveFilter: GuideActive;
  pharmaCare: PharmaCare;
  pharmaCareForm: FormGroup;
  pharmaCareDialog: boolean;
  dryIceSupplyDialog: boolean;
  remark:string;
  pharmaCoolCaresView: PharmaCoolCareView[];
  pharmaCoolCareView: PharmaCoolCareView;
  monitoringHour: string;
  pharmaCoolCareForm: FormGroup;
  dryIceSupplyForm: FormGroup;
  pharmaCoolCareDialog: boolean;
  pharmaCoolCareDetail: PharmaCoolCareDetail[];
  waybillRpaDryIceSupply: WaybillRpaDryIceSupply;
  monitoringDialog: boolean;
  monitoringTime: Array<{ label: string; value: any }>;
  pharmaCoolCareDetails: PharmaCoolCareDetail[];
  titlePharmaCoolCare: string;

  imgBtnAcceptance: string =  '../../../../assets/img/pharma/states/icons8_system_task_128px.png';
  imgBtnStorageIn: string =  '../../../../assets/img/pharma/states/icons8_airplane_take_off_96px.png';
  imgBtnPendingArrival: string = '../../../../assets/img/pharma/states/airplane_landing_48px.png';
  imgBtnMonitoring: string =  '../../../../assets/img/pharma/states/icons8_system_task_128px.png';
  imgBtnTransit: string =  '../../../../assets/img/pharma/states/Icono_Transito.png';
  imgBtnResupply: string =  '../../../../assets/img/pharma/states/R3abastciminto.png';
  imgBtnDelivery: string =  '../../../../assets/img/pharma/states/delivery.png';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private transactionService: TransactionService,
    private messageService: MessageService,
    private constantService: ConstantService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService,
  ) {
    this.user = this.authService.currentUserValue;

    this.pharmaCareForm = this.fb.group({
      id: ['', null],
      temperature: ['', Validators.required],
      additionalComments: ['']
    });

    this.pharmaCoolCareForm = this.fb.group({
      id: ['', null],
      monitoringTime: ['', Validators.required],
      containerNumber: [''],
      temperature: [''],
      battery: [''],
      currentTemp: ['']
    });

    this.monitoringTime = [
      { label: '--:--', value: null },
      { label: '00:00 HRS', value: '00:00' },
      { label: '03:00 HRS', value: '03:00' },
      { label: '06:00 HRS', value: '06:00' },
      { label: '09:00 HRS', value: '09:00' },
      { label: '12:00 HRS', value: '12:00' },
      { label: '15:00 HRS', value: '15:00' },
      { label: '18:00 HRS', value: '18:00' },
      { label: '21:00 HRS', value: '21:00' }
    ];

    this.dryIceSupplyForm = this.fb.group({
      remark: ['', Validators.required]
    });
  }

  get f() {
    return this.pharmaCareForm.controls;
  }

  get g() {
    return this.dryIceSupplyForm.controls;
  }

  ngOnInit(): void {
    this.dryIceSupplyDialog = false;
    this.pagination = new Pagination();
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
    this.guideActiveFilter = new GuideActive();
    this.guideActive = new GuideActive();
  }

  openCriticalPoint(guideActive: any) {
    this.guideActive = { ...guideActive };

    if (this.guideActive.productTypeId == 1) {
      this.guideActive.waybillStatus.pharmaCares = [];
      this.pharmaCare = new PharmaCare();
      this.pharmaCare.waybillStatusId = this.guideActive.waybillStatus.id;
      this.pharmaCareDialog = true;
    }

    if (this.guideActive.productTypeId == 2 || this.guideActive.productTypeId == 3) {
      if ((this.guideActive.waybillStatus.statusId == 2 || this.guideActive.waybillStatus.statusId == 3) && this.guideActive.waybillStatus.stationId == this.guideActive.destinyRedStationId)
        this.titlePharmaCoolCare = this.translateService.instant('module.guideActive.pharmaCoolCare.monitoringTitle', "monitoringTitle") + " " + "Delivery";
      else if (this.guideActive.waybillStatus.statusId == 1 || this.guideActive.waybillStatus.statusId == 5)
        this.titlePharmaCoolCare = this.translateService.instant('module.guideActive.pharmaCoolCare.monitoringTitle', "monitoringTitle") + " " + "Storage IN";
      else
        this.titlePharmaCoolCare = this.translateService.instant('module.guideActive.pharmaCoolCare.monitoringTitle', "monitoringTitle") + " " + "Storage Out";

      this.monitoringHour = null;
      this.guideActive.waybillStatus.pharmaCoolCares = [];
      this.loadPharmaCoolCares(this.guideActive.waybillStatus.id);
      this.pharmaCoolCaresView = [];
      this.pharmaCoolCareDialog = true;
    }
  }

  hideTemperatureControlDialog() {
    this.pharmaCareDialog = false;
    this.submitted = false;
  }

  validateSavePharmaCare() {
    this.submitted = true;
    this.loading = true;

    if (this.pharmaCareForm.invalid) {
      this.loading = false;
      return;
    }

    if (this.pharmaCare.temperature < this.guideActive.productInitialRange
      || this.pharmaCare.temperature > this.guideActive.productFinalRange) {
      this.confirmationService.confirm({
        message: 'You wont´t be able to revert this!', header: 'This shipment have a temperature deviation, do you wish to continue?',
        icon: 'pi pi-exclamation-triangle',
        key: 'confirmDialogActive',
        accept: () => {
          //Se guarda la indicación de alerta generada
          this.pharmaCare.acceptanceOutRange = true;
          this.savePharmaCare();
        },
        reject: () => {
          this.loading = false;
          return;
        }
      });
    } else {
      this.savePharmaCare();
    }
  }

  savePharmaCare() {
    this.pharmaCare.minTemp = this.guideActive.product.initialRange;
    this.pharmaCare.maxTemp = this.guideActive.product.finalRange;
    this.pharmaCare.userId = this.user.id;
    this.pharmaCare.stationId = this.filters.airWaybillSearch.station;
    this.pharmaCare.createdDate = moment().toISOString(true);
    this.guideActive.waybillStatus.pharmaCares.push(this.pharmaCare);

    this.transactionService.update(environment.pharmaAPI, this.constantService.WAYBILL_RPA_URL, this.guideActive).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: 'Pharma Care',
            detail: data.responseDto.message,
            life: 3000,
          });
          this.hidePharmaCareDialog();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Pharma Care',
            detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
          this.guideActive.waybillStatus.pharmaCares = [];
        }
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Aerolíneas',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  hidePharmaCareDialog() {
    this.getPaginationAndFilterActives();
    this.guideActive.waybillStatus.pharmaCares = [];
    this.pharmaCare = new PharmaCare();
    this.pharmaCareDialog = false;
    this.submitted = false;
    this.loading = false;
  }

  loadPharmaCoolCares(waybillStatusId: Number) {
    this.transactionService.getAll(environment.pharmaAPI, this.constantService.PHARMA_COOL_CARE_URL + '/GetPharmaCoolCareByWSId/' + waybillStatusId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.guideActive.waybillStatus.pharmaCoolCares = data.businessDto;

          this.pharmaCoolCaresView = [];
          for (let index = 0; index < data.businessDto.length; index++) {
            this.pharmaCoolCaresView.push({
              container: data.businessDto[index].container,
              setTemp: data.businessDto[index].setTemp,
              voltage: data.businessDto[index].voltage,
              temperature: data.businessDto[index].temperature
            })
          }

          if (this.guideActive.waybillStatus.noDownload == true) {
            this.savePharmaCoolCares();
          }
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

  validateSavePharmaCoolCare() {
    this.submitted = true;
    this.loading = true;

    let outRange: Boolean = false;

    // this.pharmaCoolCaresView.forEach(i => {
    //   if (i.temperature < this.guideActive.productInitialRange || i.temperature > this.guideActive.productFinalRange) {
    //     outRange = true;
    //   }
    // });

    this.pharmaCoolCaresView.forEach(i => {
      if (i.temperature < this.guideActive.productInitialRange && i.temperature < this.guideActive.productFinalRange) {
        outRange = true;
      }
    });
    
    if (outRange == true) {
      this.confirmationService.confirm({
        message: 'You wont´t be able to revert this!', 
        header: 'This shipment have a temperature deviation, do you wish to continue?',
        icon: 'pi pi-exclamation-triangle',
        key:'confirmDialogActive',
        accept: () => {
          this.savePharmaCoolCares();
        },
        reject: () => {
          this.loading = false;
          return;
        }
      });
    } else {
      this.savePharmaCoolCares();
    }
  }

  savePharmaCoolCares() {
    for (let i = 0; i < this.pharmaCoolCaresView.length; i++) {
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail = new PharmaCoolCareDetail();
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.battVoltage = this.pharmaCoolCaresView[i].voltage;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.currentTemp = this.pharmaCoolCaresView[i].temperature;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.setTmp = this.pharmaCoolCaresView[i].setTemp;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.hour = this.monitoringHour;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.userId = this.user.id;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.pharmaCoolCareId = this.guideActive.waybillStatus.pharmaCoolCares[i].id;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.statusId = this.guideActive.waybillStatus.statusId;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.stationId = this.filters.airWaybillSearch.station;
      this.guideActive.waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.createdDate = moment().toISOString(true);
    }

    this.transactionService.update(environment.pharmaAPI, this.constantService.WAYBILL_RPA_URL, this.guideActive).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: 'Pharma Care',
            detail: data.responseDto.message,
            life: 3000,
          });
          this.getPaginationAndFilterActives();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Pharma Care',
            detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Aerolíneas',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );

    this.hidePharmaCoolCareDialog();
  }

  hidePharmaCoolCareDialog() {
    this.pharmaCoolCareDialog = false;
    this.submitted = false;
    this.loading = false;
  }

  openMonitoring(guideActive: any) {
    this.guideActive = { ...guideActive };
    this.monitoringHour = null;
    this.guideActive.waybillStatus.pharmaCoolCares = [];
    this.loadPharmaCoolCares(this.guideActive.waybillStatus.id);
    this.pharmaCoolCaresView = [];
    this.monitoringDialog = true;
  }

  validateMonitoringPharmaCoolCare() {
    this.submitted = true;
    this.loading = true;

    if (this.monitoringHour == null) {
      this.loading = false;
      return;
    }

    let outRange: Boolean = false;

    this.pharmaCoolCaresView.forEach(i => {
      if (i.temperature < this.guideActive.productInitialRange || i.temperature > this.guideActive.productFinalRange) {
        outRange = true;
      }
    });
    
    if (outRange == true) {
      this.confirmationService.confirm({
        message: 'You wont´t be able to revert this!', 
        header: 'This shipment have a temperatura deviation, do you wish to continue?',
        icon: 'pi pi-exclamation-triangle',
        key:'confirmDialogActive',
        accept: () => {
          this.saveMonitoring();
        },
        reject: () => {
          this.loading = false;
          return;
        }
      });
    } else {
      this.saveMonitoring();
    }
  }

  saveMonitoring() {
    let waybillStatus = new WaybillStatus();
    waybillStatus = this.guideActive.waybillStatus;
    waybillStatus.pharmaCoolCares = this.guideActive.waybillStatus.pharmaCoolCares;
    waybillStatus.statusId = 3;
    waybillStatus.updatedDate = new Date();

    for (let i = 0; i < this.pharmaCoolCaresView.length; i++) {
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail = new PharmaCoolCareDetail();
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.battVoltage = this.pharmaCoolCaresView[i].voltage;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.currentTemp = this.pharmaCoolCaresView[i].temperature;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.setTmp = this.pharmaCoolCaresView[i].setTemp;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.hour = this.monitoringHour;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.userId = this.user.id;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.pharmaCoolCareId = this.guideActive.waybillStatus.pharmaCoolCares[i].id;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.statusId = 3;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.stationId = this.filters.airWaybillSearch.station;
      waybillStatus.pharmaCoolCares[i].pharmaCoolCareDetail.createdDate = moment().toISOString(true);
    }

    this.transactionService.update(environment.pharmaAPI, this.constantService.WAYBILL_STATUS_URL, waybillStatus).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: 'Monitoring',
            detail: data.responseDto.message,
            life: 3000,
          });
          this.getPaginationAndFilterActives();
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Monitoring',
            detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
        }
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Monitoring',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );

    this.hideMonitoringDialog();
  }

  hideMonitoringDialog() {
    this.monitoringDialog = false;
    this.submitted = false;
    this.loading = false;
  }

  noDownload(guideActive: any) {
    this.confirmationService.confirm({
      message: 'You will not be able to reverse this!', header: 'Are you sure to confirm the transit without temperature monitoring?',
      icon: 'pi pi-exclamation-triangle',
      key: 'confirmDialogActive',
      accept: () => {
        this.guideActive = { ...guideActive };
        this.guideActive.waybillStatus.noDownload = true;

        if (this.guideActive.productTypeId == 1) {
          this.guideActive.waybillStatus.pharmaCares = [];
          this.pharmaCare = new PharmaCare();
          this.loadPharmaCarePrevious(this.guideActive.waybillStatus.stationId, this.guideActive.docNum);
        }

        if (this.guideActive.productTypeId == 2) {
          this.monitoringHour = "00:00";
          this.guideActive.waybillStatus.pharmaCoolCares = [];

          this.loadPharmaCoolCares(this.guideActive.waybillStatus.id);
        }
      },
    });
  }

  loadPharmaCarePrevious(wbsStationId: Number, wbrDocNum: String) {
    this.transactionService.getAll(environment.pharmaAPI, this.constantService.PHARMA_CARE_URL + '/' + wbsStationId + '/' + wbrDocNum).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.pharmaCare.temperature = data.businessDto[0].temperature;
          this.savePharmaCare();
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

  loadGuidesActives(event: LazyLoadEvent) {

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

    this.getPaginationAndFilterActives();
    this.loading = false;
  }

  getPaginationAndFilterActives() {
    if (this.filters.airWaybillSearch.station != null) {
      let filter = new FilterQuery();
      this.guideActiveFilter.waybillStatus = new WaybillStatus();
      this.guideActiveFilter.waybillStatus.stationId = this.filters.airWaybillSearch.station;

      filter = {
        filterDto: this.guideActiveFilter,
        paginationDto: this.pagination
      };

      this.transactionService.getPaginationAndFilterActives(environment.pharmaAPI, this.constantService.WAYBILL_RPA_URL, filter).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.filters.guideActives = data.businessDto;
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
  }

  resupply(guideActive: any) {
    this.dryIceSupplyDialog = true;
    this.guideActive = { ...guideActive };
    this.remark = "";
  }


  saveDryIceSupply() {

    this.submitted = true;
    if (this.dryIceSupplyForm.invalid) {
      this.loading = false;
      return;
    }

    this.waybillRpaDryIceSupply = new WaybillRpaDryIceSupply();
    this.waybillRpaDryIceSupply.dryIceSupplyId = this.guideActive.dryIceSupply.id;
    this.waybillRpaDryIceSupply.remark = this.remark
    this.waybillRpaDryIceSupply.createdDate = moment().toISOString(true);
    this.waybillRpaDryIceSupply.createdUserId = this.user.id

    this.transactionService.save(environment.pharmaAPI, this.constantService.WAYBILL_RPA_DRY_ICE_SUPPY_URL, this.waybillRpaDryIceSupply).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.submitted = false;
          this.dryIceSupplyDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Pharma Care',
            detail: data.responseDto.message,
            life: 3000,
          });
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: 'Pharma Care',
            detail: data.responseDto.message + ' , por favor inténtelo de nuevo!',
            life: 8000,
          });
          this.guideActive.waybillStatus.pharmaCares = [];
        }
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Pharma Care',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
    // }
  }

  loadActive(event: LazyLoadEvent) {
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

    this.getPaginationAndFilterActives();
    this.loading = false;
  }
}
