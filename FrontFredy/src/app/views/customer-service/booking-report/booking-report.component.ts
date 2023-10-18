import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { ConstantService } from '../../../constant/constant-service';
import { TransactionService } from '../../../services/transaction.service';
import { AuthService } from '../../../services/auth.service';
import { environment } from '../../../../environments/environment';
import { Quotation } from '../../../model/quotation';
import { FilterQuery } from '../../../model/filter-query';
import { BookingReport } from '../../../model/booking-report';
import { Pagination } from '../../../model/pagination';
import { Workbook } from 'exceljs';
import { BookingModel } from '../../../model/bookingModel';
import * as fs from 'file-saver';
import { QuotesBookingsReport } from '../../../model/quotes-bookings-report';
import { Station } from '../../../model/station';
import { invalid } from '@angular/compiler/src/render3/view/util';
import moment from 'moment';

@Component({
  selector: 'app-booking-report',
  templateUrl: './booking-report.component.html',
  styleUrls: ['./booking-report.component.css']
})
export class BookingReportComponent implements OnInit {

  submitted: boolean;
  loading: boolean;
  bookingForm: FormGroup;
  originStation: any;
  destinationStation: any;
  quotation: Quotation;
  bookingFind: BookingReport;
  quotationFind: Quotation;
  rangeDate: Date;
  pagination: Pagination;
  bookingPrincipal: BookingModel[];
  quotationPrincipal: Quotation[];
  sumPiece: Number;
  quotesBookingsReports: QuotesBookingsReport[];

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private translateService: TranslateService,
    private authService: AuthService) {

    this.bookingForm = this.fb.group({
      originStation: [''],
      destinationCity: [''],
      rangeDateReport: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.bookingFind = new BookingReport();
    this.quotationFind = new Quotation();
    this.submitted = false;
    this.rangeDate = null;

    this.pagination = new Pagination();
    this.pagination.pageSize = 50;
    this.pagination.pageNo = 0;
    this.sumPiece = 0;
  }

  get f() {
    return this.bookingForm.controls;
  }

  getFilter() {
    this.submitted = true;
    this.loading = true;

    if (this.rangeDate == null) {
      this.loading = false;
      return;
    } else {
      if (this.rangeDate[0] == null || this.rangeDate[1] == null) {
        this.loading = false;
        return;
      }
    }

    if (this.originStation != null) {
      this.bookingFind.originId = this.originStation.id;
      this.quotationFind.originStationId = this.originStation.id;
    }

    if (this.destinationStation != null) {
      this.bookingFind.destinationId = this.destinationStation.id;
      this.quotationFind.destinationStationId = this.destinationStation.id;
    }

    this.quotesBookingsReports = [];
    this.quotationPrincipal = [];
    this.bookingPrincipal = [];
    this.getBookingFilter();
    this.getQuotationFilter();
    this.submitted = false;
    this.loading = false;
  }

  getBookingFilter() {
    this.bookingFind.startDate = this.rangeDate[0];
    this.bookingFind.endDate = this.rangeDate[1];

    let filter = new FilterQuery();
    filter = {
      filterDto: this.bookingFind,
      paginationDto: this.pagination,
    };
    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, `${this.constantService.BOOKING_URL}/GetBookingReport`, filter).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.bookingPrincipal = data.businessDto;
            

            this.bookingPrincipal.forEach(b => {
              this.quotesBookingsReports.push({
                id: b.id,
                type: this.translateService.instant('module.bookingReport.booking', "booking"),
                requirementDate: b.createdDate,
                assignmentDate: b.quotation?.quotationAsignment.createdDate,
                answerDate: b.quotation?.creationDate,
                user: b.quotation?.quotationAsignment.userAsignmentFirstName,
                company: b.company,
                userName: b.userName,
                origin: b.orgStation.name,
                destination: b.destStation.name,
                customerType: b.quotation?.customerType,
                quantityPieces: b.piece,
                commodity: b.loadTypeName,
                stackable: b.removable,
                chargableweight: b.chargeableWeight,
                rate: b.rate,
                status: b.bookingHistoryLastStatus?.bookingStatus.name,
                temperatureControl: b.usingPerishable ? this.translateService.instant('module.componentNames.yes', "yes") : "No"
              });
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

  getQuotationFilter() {
    this.quotationFind.creationDateStart = this.rangeDate[0];
    this.quotationFind.creationDateEnd = this.rangeDate[1];

    let filter = new FilterQuery();
    filter = {
      filterDto: this.quotationFind,
      paginationDto: this.pagination,
    };
    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, `${this.constantService.QUOTATION_URL}/GetQuotationgReport`, filter).subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.quotationPrincipal = data.businessDto;

            this.quotationPrincipal.forEach(q => {
              this.quotesBookingsReports.push({
                id: q.id,
                type: this.translateService.instant('module.bookingReport.quotation', "quotation"),
                requirementDate: q.creationDate,
                assignmentDate: q.quotationAsignment?.updatedDate,
                answerDate: q.quotationStatus?.creationDate,
                user: q.quotationStatus?.creationUser.firstName,
                company: q.company,
                userName: q.name,
                origin: q.originStationDesc,
                destination: q.destinationStationDesc,
                customerType: q.customerType,
                quantityPieces: q.numberPieces,
                commodity: q.loadType,
                stackable: q.removable,
                chargableweight: q.chargableWeight,
                rate: q.quotationStatus?.rate,
                status: q.quotationStatus ? q.quotationStatus.status :
                  q.quotationAsignment ? this.translateService.instant('module.bookingReport.statuses.assigned', "assigned") :
                    this.translateService.instant('module.bookingReport.statuses.pending', "pending"),
                temperatureControl: q.usingPerishable ? this.translateService.instant('module.componentNames.yes', "yes") : "No"
              });
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

  exportTrackAwb() {
    this.loading = true;
    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('Report');
    const title = 'Booking';
    const header = ['ID', 'Request Type', 'Requirement Date', 'Assignment Date', 'Answer Date', 'User', 'Company', 'Name', 'Origin', 'Destination', 'Customer Type', 'Quantity of pieces', 'Commodity', 'Stackable', 'Chargable weight', 'Rate', 'Status', 'Temperature control', 'Total Amount']
    const principalLeg = [];

    this.quotesBookingsReports.forEach(i => {
      principalLeg.push([
        i.id,
        i.type,
        moment(i.requirementDate).format("YYYY/MM/DD HH:mm"),
        moment(i.assignmentDate).format("YYYY/MM/DD HH:mm"),
        moment(i.answerDate).format("YYYY/MM/DD HH:mm"),
        i.user,
        i.company,
        i.userName,
        i.origin,
        i.destination,
        i.customerType,
        i.quantityPieces,
        i.commodity,
        i.stackable,
        i.chargableweight,
        i.rate,
        i.status,
        i.temperatureControl,
        0
      ]);
    });

    const data = principalLeg;
    // Se quita titulo, segun indicación dada en BUG308280
    /*const titleRow = worksheet.addRow([title]);
    titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
    */
    worksheet.addRow([]);
    //const subTitleRow = worksheet.addRow(['Date : ' + this.datePipe.transform(new Date(), 'medium')]);
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' },
        bgColor: { argb: 'FFFF0000' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    data.forEach(d => {
      const row = worksheet.addRow(d);
    });

    worksheet.getColumn(3).width = 30;
    worksheet.getColumn(4).width = 30;
    worksheet.addRow([]);

    workbook.xlsx.writeBuffer().then((data) => {
      let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, 'Booking_Report.xlsx');
    });
  }

  receiveOriginStation(station: Station) {
    this.originStation = station;
  }

  receiveDestinationStation(station: Station) {
    this.destinationStation = station;
  }
}
