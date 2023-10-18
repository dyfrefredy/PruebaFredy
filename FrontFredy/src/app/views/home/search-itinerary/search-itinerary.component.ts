import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { LazyLoadEvent, MessageService } from 'primeng/api';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { FilterQuery } from '../../../model/filter-query';
import { Itinerary } from '../../../model/itinerary';
import { OrderTable } from '../../../model/order-table';
import { Pagination } from '../../../model/pagination';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-search-itinerary',
  templateUrl: './search-itinerary.component.html',
  styleUrls: ['./search-itinerary.component.css']
})
export class SearchItineraryComponent implements OnInit {
  searchItineraryForm: FormGroup;
  loading: boolean;
  submitted: boolean;
  departureCity:any;
  arrivalCity:any;

  itineraries: Itinerary[];
  selecteditinerary:Itinerary;
  itineraryFind: Itinerary;
  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 5;
  last: Number = 1;

  constructor(
    private fb: FormBuilder,
    private messageService: MessageService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private translateService: TranslateService
  ) {
    this.searchItineraryForm = this.fb.group({
      departureCity: [''],
      arrivalCity: [''],
      flightDate: [''],
      itineraryCategoryType: [''],
    });
    this.itineraryFind = new Itinerary();
    this.itineraryFind.categoryId = 0;
  }

  get f() {
    return this.searchItineraryForm.controls;
  }

  ngOnInit(): void {
    this.pagination = new Pagination();
    this.pagination.pageSize = 5;
    this.pagination.pageNo = 1;
  }

  GetItineraries() {
    this.submitted = true;
    this.loading = true;
    // stop here if airlineform is invalid
    if (this.searchItineraryForm.invalid) {
      this.loading = false;
      return;
    }

    this.getPaginationAndFilter();
  }

  getPaginationAndFilter() {
    let filter = new FilterQuery();

    if(this.departureCity != null){
      this.itineraryFind.departureCityId = this.departureCity.id;
    }

    if(this.arrivalCity != null){
      this.itineraryFind.arrivalCityId = this.arrivalCity.id;
    }
    if(this.itineraryFind.departureDate == null){
      this.itineraryFind.departureDate = undefined;
    }

    filter = {
      filterDto: this.itineraryFind,
      paginationDto: this.pagination
    };

    this.transactionService.getPaginationAndFilter(environment.adminAPI, this.constantService.CHECK_ITINERARY_URL, filter).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.itineraries = data.businessDto;
          this.totalRecords = data.totalRecords;
        } else {
          this.messageService.add({
            severity: 'warn',
            summary: this.translateService.instant('module.searchItinerary.moduleName', "moduleName"),
            detail: data.responseDto.message,
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: this.translateService.instant('module.searchItinerary.moduleName', "moduleName"),
          detail: this.translateService.instant('module.alerts.errorWeb', "errorWeb"),
        });
      }
    );

  }

  loadItinearies(event: LazyLoadEvent) {
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
