import { AuthService } from './../../../services/auth.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ConfirmationService, LazyLoadEvent, MessageService } from 'primeng/api';
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
import { GuideAlert } from '../../../model/guide-alert';
import { environment } from '../../../../environments/environment';
import { OrderTable } from '../../../model/order-table';

@Component({
  selector: 'app-guide-notify',
  templateUrl: './guide-notify.component.html',
  styleUrls: ['./guide-notify.component.css']
})
export class GuideNotifyComponent implements OnInit {

  @Input() filters: {
    guideAlert: GuideAlert[],
    airWaybillSearch: AirWaybillSearch
  };

  @Output() childGetGuides = new EventEmitter<any>();

  filterAcceptance() {
    this.childGetGuides.emit(null);
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
  user: User;
  statusId: Number = 1; /*Estado Aceptacion.*/

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  constructor(private fb: FormBuilder, private authService: AuthService, private transactionService: TransactionService, private constantService: ConstantService, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.product = new Product();
    this.pharmaCare = new PharmaCare();
    this.pharmaCoolCares = [];
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
    this.pagination = new Pagination();
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
  }


  getPaginationAndFilter() {

    if (this.filters.airWaybillSearch.station != null) {
      var authUser = this.authService.getAccount();
      let guideAlert = {
        brdPtStationId: this.filters.airWaybillSearch.station,
        email: authUser.idToken.emails[0]
      };
      let filter = new FilterQuery();
      // this.guideAcceptanceFind.brdPtStationId = this.filters.airWaybillSearch.station;
      // this.guideAcceptanceFind.docNum = this.filters.airWaybillSearch.awb;
      filter = {
        filterDto: guideAlert,
        paginationDto: this.pagination,
      };
      this.transactionService
        .getPaginationAndFilter(environment.pharmaAPI, `${this.constantService.WAYBILL_RPA_URL}/GetPharmaNotify`, filter)
        .subscribe(
          (data) => {
            if (data.responseDto.response === this.constantService.RESPONSE_OK) {

              this.filters.guideAlert = data.businessDto;
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

  loadNotify(event: LazyLoadEvent) {
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
