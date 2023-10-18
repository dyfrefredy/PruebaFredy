import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, MessageService, LazyLoadEvent } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { AirWaybillSearch } from '../../../model/air-waybill-search';
import { FilterQuery } from '../../../model/filter-query';
import { GuideAcceptance } from '../../../model/guide-acceptance';
import { Pagination } from '../../../model/pagination';
import { PharmaCare } from '../../../model/pharma-care';
import { PharmaCoolCare } from '../../../model/pharma-cool-care';
import { Product } from '../../../model/product';
import { WaybillStatus } from '../../../model/waybill-status';
import { TransactionService } from '../../../services/transaction.service';
import { User } from '../../../model/user';
import { environment } from '../../../../environments/environment';
import moment from 'moment';
import { Question } from '../../../model/question';
import { ChecklistContainerAnswer } from '../../../model/checklist-container-answer';
import { ChecklistContainer } from '../../../model/checklist-container';
import { OrderTable } from '../../../model/order-table';
import { PharmaCoolCareDetail } from '../../../model/pharma-cool-care-detail';

@Component({
  selector: 'app-guide-acceptance',
  templateUrl: './guide-acceptance.component.html',
  styleUrls: ['./guide-acceptance.component.scss']
})
export class GuideAcceptanceComponent implements OnInit {
  @Input() filters: {
    guideAcceptances: GuideAcceptance[],
    airWaybillSearch: AirWaybillSearch
  };
  @Input() totalRecords: number;
  @Output() childGetGuides = new EventEmitter<any>();

  filterAcceptance() {
    this.getPaginationAndFilter();
  }

  submitted: boolean;
  loading: boolean;

  selectedGuideAcceptance: GuideAcceptance;
  pharmaCareDialog: Boolean;
  pharmaCoolCareDialog: Boolean;
  product: Product;
  pharmaCareForm: FormGroup;
  pharmaCoolCareForm: FormGroup;
  pharmaCare: PharmaCare;
  pharmaCoolCares: PharmaCoolCare[];
  pharmaCoolCare: PharmaCoolCare;
  waybillStatus: WaybillStatus;
  guideAcceptanceFind: GuideAcceptance;
  question: Question[];
  selectedOption: any;
  containerTypeOptions: Array<{ label: string; value: any }>;
  containerTypeId: any;
  checklistContainerAnswer: ChecklistContainerAnswer[];
  checklistContainer: ChecklistContainer;

  user: User;
  statusId: Number = 1; /*Estado Aceptacion.*/

  pagination: Pagination;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  totalRecordsQuestion: number;

  constructor(private fb: FormBuilder, private authService: AuthService, private transactionService: TransactionService, private constantService: ConstantService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.product = new Product();
    this.pharmaCare = new PharmaCare();
    this.waybillStatus = new WaybillStatus();
    this.pharmaCoolCare = new PharmaCoolCare();
    this.guideAcceptanceFind = new GuideAcceptance();
    this.pharmaCareForm = this.fb.group({
      temperature: ['', Validators.required],
      comments: ['']
    });
    this.user = this.authService.currentUserValue;
    this.pharmaCoolCareForm = this.fb.group({
      container: ['', Validators.required],
      setTemp: ['', Validators.required],
      voltage: ['', Validators.required],
      temperature: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.checklistContainerAnswer = [];
    this.checklistContainer = new ChecklistContainer();
    this.pharmaCoolCare.checklistContainer = [];
    this.pagination = new Pagination();
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
  }

  openDialogPharmaCare(memberInfo: any) {
    this.selectedGuideAcceptance = { ...memberInfo };
    this.getPorduct(this.selectedGuideAcceptance.productId);
    this.pharmaCare = new PharmaCare();
    this.pharmaCareDialog = true;
  }

  openDialogPharmaCoolCare(memberInfo: any) {
    this.selectedGuideAcceptance = { ...memberInfo };
    this.getPorduct(this.selectedGuideAcceptance.productId);
    this.pharmaCoolCares = [];
    this.pharmaCoolCare = new PharmaCoolCare();    
    this.pharmaCoolCare.checklistContainer = [];
    this.containerTypeId = null;
    this.getContainerTypes();
    this.question = [];
    this.checklistContainer = new ChecklistContainer();
    this.pharmaCoolCareDialog = true;
  }

  change(answer: any, questionId: any, questionName: any) {

    if (!this.checklistContainerAnswer.find(x => x.questionId == questionId)) {
      let questionAnswer = new ChecklistContainerAnswer();
      questionAnswer.question = new Question();
      questionAnswer.answerTypeId = answer;
      questionAnswer.questionId = questionId;
      questionAnswer.question.name = questionName;
      questionAnswer.createdUserId = this.user.id;
      this.checklistContainerAnswer.push(questionAnswer);
    } else {
      var idxQuestion = this.checklistContainerAnswer.findIndex(x => x.questionId == questionId);
      this.checklistContainerAnswer[idxQuestion].answerTypeId = answer;
      this.checklistContainerAnswer[idxQuestion].question.name = questionName;

    }


  }

  validatePharmaCoolCare() {
    this.submitted = true;
    this.loading = true;
    
    if (this.product.initialRange > this.pharmaCoolCare.temperature || this.product.finalRange < this.pharmaCoolCare.temperature) {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        key: 'confirmDialogAcceptance',
        accept: () => {
          this.addPharmaCoolCare()
        },
        reject: () => {
          this.loading = false;
          return;
        }
      });
    }
    else{
      this.addPharmaCoolCare()
    }
  }

  addPharmaCoolCare() {
    // stop here if airlineform is invalid
    if (this.pharmaCoolCareForm.invalid || this.question.length != this.checklistContainerAnswer.length) {
      this.loading = false;
      return;
    }

    var answerResult = this.checklistContainerAnswer.filter(x => x.question.name == "NO");
    if (answerResult.length > 0 && (this.checklistContainer.remark == "" || this.checklistContainer.remark == undefined))
      this.loading = false;

    if (this.checklistContainer.shipmentTypeId == 0 || this.checklistContainer.shipmentTypeId == undefined)
      this.loading = false;

    if (!this.loading)
      return;

    this.checklistContainer.checklistContainerAnswer = this.checklistContainerAnswer;
    this.checklistContainer.createdUserId = this.user.id;

    this.pharmaCoolCare.minTemp = this.product.initialRange;
    this.pharmaCoolCare.maxTemp = this.product.finalRange;
    this.pharmaCoolCare.userId = this.user.id;
    this.pharmaCoolCare.createdDate = moment().toISOString(true);

    this.pharmaCoolCare.pharmaCoolCareDetail = new PharmaCoolCareDetail();
    this.pharmaCoolCare.pharmaCoolCareDetail.battVoltage = this.pharmaCoolCare.voltage;
    this.pharmaCoolCare.pharmaCoolCareDetail.currentTemp = this.pharmaCoolCare.temperature;
    this.pharmaCoolCare.pharmaCoolCareDetail.setTmp = this.pharmaCoolCare.setTemp;
    this.pharmaCoolCare.pharmaCoolCareDetail.userId = this.pharmaCoolCare.userId;
    this.pharmaCoolCare.pharmaCoolCareDetail.createdDate = this.pharmaCoolCare.createdDate;
    this.pharmaCoolCare.pharmaCoolCareDetail.hour = '00:00';
    this.pharmaCoolCare.pharmaCoolCareDetail.statusId = this.statusId;
    this.pharmaCoolCare.pharmaCoolCareDetail.stationId = this.filters.airWaybillSearch.station;

    this.pharmaCoolCare.checklistContainer.push(this.checklistContainer);
    this.pharmaCoolCares.push(this.pharmaCoolCare);

    this.pharmaCoolCare = new PharmaCoolCare();
    this.containerTypeId = null;
    this.pharmaCoolCare.checklistContainer = [];
    this.question = [];
    this.checklistContainer = new ChecklistContainer();
    this.checklistContainerAnswer = [];
    this.submitted = false;
  }

  deletePharmaCoolCare(containerIndex) {
    this.pharmaCoolCares.splice(containerIndex, 1);
  }

  getPorduct(productId: Number) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.PRODUCT_URL, '/' + productId).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          if (data.businessDto != null) {
            this.product = data.businessDto[0]
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  saveWaybilStatusPharmaCoolCare(pharmaCoolCares: any) {
    if (this.pharmaCoolCares.length < 1) {
      this.loading = false;
      return;
    }

    this.waybillStatus.stationId = this.filters.airWaybillSearch.station;
    this.waybillStatus.userId = this.user.id;
    this.waybillStatus.statusId = this.statusId;
    this.waybillStatus.waybillRpaId = this.selectedGuideAcceptance.id;
    this.waybillStatus.pharmaCoolCares = pharmaCoolCares;
    this.transactionService.save(environment.pharmaAPI, this.constantService.WAYBILL_STATUS_URL, this.waybillStatus).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
          this.pharmaCoolCareDialog = false;
          this.submitted = false;
          this.pharmaCoolCare = new PharmaCoolCare();
          this.pharmaCare = new PharmaCare();
          this.waybillStatus = new WaybillStatus();
          this.pharmaCoolCares=[];
          this.submitted = false;
          this.pharmaCareDialog = false;
          this.pharmaCoolCareDialog = false;
          //this.getPaginationAndFilter();
          this.childGetGuides.emit();
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

  saveWaybilStatusPharmaCare() {
    this.submitted = true;
    this.loading = true;

    // stop here if airlineform is invalid
    if (this.pharmaCareForm.invalid) {
      this.loading = false;
      return;
    }
    this.waybillStatus.waybillRpaId = this.selectedGuideAcceptance.id;
    this.waybillStatus.statusId = this.statusId;
    this.waybillStatus.stationId = this.filters.airWaybillSearch.station;
    this.waybillStatus.userId = this.user.id;
    this.waybillStatus.pharmaCares = [];
    this.pharmaCare.minTemp = this.product.initialRange;
    this.pharmaCare.maxTemp = this.product.finalRange;
    this.pharmaCare.userId = this.user.id;
    this.pharmaCare.statusId = this.statusId;
    this.pharmaCare.stationId = this.filters.airWaybillSearch.station;
    this.pharmaCare.createdDate = moment().toISOString(true);
    this.waybillStatus.pharmaCares.push(this.pharmaCare)

    if (this.product.initialRange <= this.pharmaCare.temperature && this.product.finalRange >= this.pharmaCare.temperature) {
      this.confirmSavePharaCare();
    } else {
      this.confirmationService.confirm({
        header: 'Confirmación',
        icon: 'pi pi-exclamation-triangle',
        key:'confirmDialogAcceptance',
        accept: () => {
          this.confirmSavePharaCare();
        }
      });
    }
  }

  confirmSavePharaCare() {
    this.transactionService.save(environment.pharmaAPI, this.constantService.WAYBILL_STATUS_URL, this.waybillStatus).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.messageService.add({
            severity: 'success',
            summary: 'Usuario',
            detail: data.responseDto.message,
          });
          this.childGetGuides.emit();
          this.pharmaCoolCare = new PharmaCoolCare();
          this.pharmaCare = new PharmaCare();
          this.waybillStatus = new WaybillStatus();
          this.submitted = false;
          this.pharmaCareDialog = false;
          this.pharmaCoolCareDialog = false;
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

  getPaginationAndFilter() {
    if(this.filters.airWaybillSearch.awb != null)
      this.guideAcceptanceFind.docNum = this.filters.airWaybillSearch.awb;
    if (this.filters.airWaybillSearch.station != null) {
      let filter = new FilterQuery();
      this.guideAcceptanceFind.brdPtStationId = this.filters.airWaybillSearch.station;
      filter = {
        filterDto: this.guideAcceptanceFind,
        paginationDto: this.pagination,
      };
      this.transactionService
        .getPaginationAndFilter(environment.pharmaAPI, this.constantService.WAYBILL_RPA_URL, filter)
        .subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {
              this.filters.guideAcceptances = data.businessDto;
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


  getContainerTypes() {
    this.transactionService.getAll(environment.adminAPI, this.constantService.CONTAINER_TYPE_URL).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.containerTypeOptions = new Array();
          this.containerTypeOptions.push({ label: 'Seleccione tipo del contenedor', value: 0 });
          for (let index = 0; index < data.businessDto.length; index++) {
            this.containerTypeOptions.push({ label: data.businessDto[index].description, value: data.businessDto[index].id });
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  onChangeContainerType() {
    this.getQuestionPaginationAndFilter();
  }

  getQuestionPaginationAndFilter() {
    const QUESTION_GENERAL = 1;
    let filter = new FilterQuery();
    filter = {
      filterDto: [QUESTION_GENERAL, this.containerTypeId],
      paginationDto: this.pagination,
    };
    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, `${this.constantService.QUESTION_URL}/GetById`, filter)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.question = data.businessDto;
            this.totalRecordsQuestion = data.totalRecords;
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

  loadAcceptance(event: LazyLoadEvent) {
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
}