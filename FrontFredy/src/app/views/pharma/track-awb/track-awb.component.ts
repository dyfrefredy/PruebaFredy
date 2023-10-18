import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { LazyLoadEvent, MessageService } from "primeng/api";
import { ConstantService } from "../../../constant/constant-service";
import { AirWaybill } from "../../../model/air-waybill";
import { AirWaybillItinerary } from "../../../model/air-waybill-itinerary";
import { FilterQuery } from "../../../model/filter-query";
import { OrderTable } from "../../../model/order-table";
import { Pagination } from "../../../model/pagination";
import { SearchTrackAwb } from "../../../model/search-track-awb";
import { TransactionService } from "../../../services/transaction.service";
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import { DatePipe } from "@angular/common";
import { AirWaybillTemperatureControlPharmaCare } from "../../../model/air-waybill-temperature-control-pharma-care";
import { AirWaybillTemperatureControlPharmaCoolCare } from "../../../model/air-waybill-temperature-control-pharma-cool-care";
import { environment } from "../../../../environments/environment";
import moment from 'moment';
import html2canvas from 'html2canvas';
import jspdf from 'jspdf';
import 'jspdf-autotable';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: "app-track-awb",
  templateUrl: "./track-awb.component.html",
  styleUrls: ["./track-awb.component.css"],
})

export class TrackAwbComponent implements OnInit {
  trackAwbForm: FormGroup;
  searchTrackAwb: SearchTrackAwb;
  airWaybillFind: AirWaybill;
  airWaybillsPrincipal: AirWaybill[];
  airWaybillItineraries: AirWaybill[];
  airWaybillItineraryfind: AirWaybillItinerary;
  airWaybillTemperatureControlFind: AirWaybillTemperatureControlPharmaCare;
  airWaybillTemperatureControlsPharmaCare: AirWaybillTemperatureControlPharmaCare[];
  airWaybillTemperatureControlPharmaCoolCare:AirWaybillTemperatureControlPharmaCoolCare[];
  airWaybillTemperatureControlPharmaCoolCareAllContainers:AirWaybillTemperatureControlPharmaCoolCare[];
  containers=[];
  showProduct:string;
  dataPharmaCare: any;
  data: any[];
  options: any;
  submitted: boolean;
  loading: boolean;

  pagination: Pagination;
  totalRecords: Number;
  first: Number = 1;
  rows: Number = 10;
  last: Number = 1;

  paginationItinerary: Pagination;
  totalRecordsItinerary: Number;
  firstItinerary: Number = 1;
  rowsItinerary: Number = 10;
  lastItinerary: Number = 1;

  paginationTemperatureControl: Pagination;
  totalRecordsTemperatureControl: Number;
  firstTemperatureControl: Number = 1;
  rowsTemperatureControl: Number = 10;
  lastTemperatureControl: Number = 1;

  contentDataURL: any;
  imageId: any;

  constructor(
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private translateService: TranslateService
  ) {
    this.trackAwbForm = this.fb.group({
      airWaybill: ["", Validators.required],
    });
    this.searchTrackAwb = new SearchTrackAwb();

  }

  ngOnInit(): void {
    this.airWaybillFind = new AirWaybill();
    this.airWaybillsPrincipal = [];
    this.airWaybillItineraries = [];
    this.airWaybillItineraryfind = new AirWaybillItinerary();
    this.airWaybillTemperatureControlFind = new AirWaybillTemperatureControlPharmaCare();

    this.pagination = new Pagination();
    this.pagination.pageSize = 10;
    this.pagination.pageNo = 1;

    this.paginationItinerary = new Pagination();
    this.paginationItinerary.pageSize = 10;
    this.paginationItinerary.pageNo = 1;

    this.paginationTemperatureControl = new Pagination();
    this.paginationTemperatureControl.pageSize = 10;
    this.paginationTemperatureControl.pageNo = 1;
  }

  get f() {
    return this.trackAwbForm.controls;
  }

  searchAirWaybill() {
    this.submitted = true;
    this.loading = true;

    // stop here if airlineform is invalid
    if (this.trackAwbForm.invalid) {
      this.loading = false;
      return;
    }
    this.getTrackAwb();
  }

  getTrackAwbPharmaCare() {
    this.transactionService
      .GetList(environment.pharmaAPI, this.constantService.WAYBILL_TRACK_AWB_URL + "/GetTemperatureChart/",this.searchTrackAwb.airWaybill)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.airWaybillTemperatureControlsPharmaCare = data.businessDto;
            let initialRange = data.businessDto.map(({ initialRange }) => initialRange);
            let finalRange = data.businessDto.map(({ finalRange }) => finalRange);
            let labels = data.businessDto.map(({ createdDate }) => moment(createdDate).format("YYYY-MM-DD HH:mm"));
            let temperature = data.businessDto.map(({ temperature }) => temperature);
            this.plotdataPharmaCare(labels,finalRange,temperature,initialRange);
          } else {
            this.messageService.add({
              severity: "warn",
              summary: "Fecha",
              detail: data.responseDto.message,
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Por favor, intente nuevamente.",
            detail: "Por favor, intente más tarde.",
          });
        }
      );
  }

  plotdataPharmaCare(labels,finalRange,temperature,initialRange)
  {
    this.dataPharmaCare = {
      labels: labels,
      datasets: [
        {
          label: 'Min. Temp',
          data: finalRange,
          fill: false,
          borderColor: '#DA291C'
        },
        {
          label: 'Monitoring temp',
          data: temperature,
          fill: false,
          borderColor: '#4dbd74'
        },
        {
          label: 'Max. Temp',
          data: initialRange,
          fill: false,
          borderColor: '#DA291C'
        },
        {
          label: '',
          data: [initialRange],
          fill: false,
          borderColor: '#0000ff00'
        }
      ]
    };
    this.options = {
      title: {
          display: true,
          text: 'Temperature',
          fontSize: 16
      },
      legend: {
          position: 'top'
      }
    };
  }

  getTrackAwbPharmaCoolCare(){
    this.transactionService
    .GetList(environment.pharmaAPI, this.constantService.WAYBILL_TRACK_AWB_URL+"/GetContainersChart/", this.searchTrackAwb.airWaybill)
    .subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.airWaybillTemperatureControlPharmaCoolCareAllContainers = data.businessDto;
          this.containers = [];
          this.data = [];
          this.airWaybillTemperatureControlPharmaCoolCareAllContainers.forEach(element => {
            if (this.containers.indexOf(element.nameContainer)<0) {
              this.containers.push(element.nameContainer);
              this.viewContainer(element.nameContainer);
            }
          });
          // for (let i = 0; i < this.airWaybillTemperatureControlPharmaCoolCareAllContainers.length; i++) {
          //   if (this.containers.indexOf(this.airWaybillTemperatureControlPharmaCoolCareAllContainers[i].nameContainer)<0) {
          //     this.containers.push(this.airWaybillTemperatureControlPharmaCoolCareAllContainers[i].nameContainer);
          //     this.viewContainer(this.containers[i]);
          //   }
          // }
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

  getTrackAwb() {
    this.transactionService
      .GetList(environment.pharmaAPI, this.constantService.WAYBILL_TRACK_AWB_URL + "/GetWaybillTrackAwb/",this.searchTrackAwb.airWaybill)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            let tempAirWaybillsPrincipal;
            console.log(data);
            tempAirWaybillsPrincipal = data.businessDto;
            this.airWaybillItineraries = data.businessDto;
            // Registros con Status:
            tempAirWaybillsPrincipal = tempAirWaybillsPrincipal.filter(w => w.waybillStatus != null);
            if(tempAirWaybillsPrincipal.length > 0){
              // Ultimo Status:
              this.airWaybillsPrincipal[0] = tempAirWaybillsPrincipal[tempAirWaybillsPrincipal.length - 1];
              if (this.airWaybillsPrincipal[0].productTypeId==1) {
                this.getTrackAwbPharmaCare();
                this.showProduct='PharmaCare';
              }
              else
              {
                this.getTrackAwbPharmaCoolCare();
                this.showProduct='PharmaCoolCare';
              }
            }
            else
              this.airWaybillsPrincipal[0] = data.businessDto[0];
            
          } else {
            this.messageService.add({
              severity: "warn",
              summary: "Fecha",
              detail: data.responseDto.message,
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Por favor, intente nuevamente.",
            detail: "Por favor, intente más tarde.",
          });
        }
      );
  }

  getAirWaybillItinerariesPaginationAndFilter() {
    let filter = new FilterQuery();
    filter = {
      filterDto: this.airWaybillFind,
      paginationDto: this.pagination,
    };

    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, this.constantService.USER_URL, filter)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.airWaybillItineraries = data.businessDto;
          } else {
            this.messageService.add({
              severity: "warn",
              summary: "Fecha",
              detail: data.responseDto.message,
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Por favor, intente nuevamente.",
            detail: "Por favor, intente más tarde.",
          });
        }
      );
  }

  getAirWaybillTemperatureControlsAndFilter() {
    let filter = new FilterQuery();
    filter = {
      filterDto: this.airWaybillTemperatureControlFind,
      paginationDto: this.pagination,
    };

    this.transactionService
      .getPaginationAndFilter(environment.adminAPI, this.constantService.USER_URL, filter)
      .subscribe(
        (data) => {
          if (data.responseDto.response === this.constantService.RESPONSE_OK) {
            this.airWaybillTemperatureControlsPharmaCare = data.businessDto;
            this.totalRecords = data.totalRecords;
          } else {
            this.messageService.add({
              severity: "warn",
              summary: "Fecha",
              detail: data.responseDto.message,
              life: 8000,
            });
          }
        },
        (error) => {
          this.messageService.add({
            severity: "error",
            summary: "Por favor, intente nuevamente.",
            detail: "Por favor, intente más tarde.",
          });
        }
      );
  }

  viewContainer(nameContainer)
  {
    this.airWaybillTemperatureControlPharmaCoolCare=this.airWaybillTemperatureControlPharmaCoolCareAllContainers.filter(val => val.nameContainer === nameContainer);
    let initialRange = this.airWaybillTemperatureControlPharmaCoolCare.map(({ minTemperature }) => minTemperature);
    let finalRange = this.airWaybillTemperatureControlPharmaCoolCare.map(({ maxTemperature }) => maxTemperature);
    let labels = this.airWaybillTemperatureControlPharmaCoolCare.map(({ createdDate }) => moment(createdDate).format("YYYY-MM-DD HH:mm"));
    let temperature = this.airWaybillTemperatureControlPharmaCoolCare.map(({ currentTemperature }) => currentTemperature)
    this.plotdata(labels,finalRange,temperature,initialRange, nameContainer);
  }

  plotdata(labels,finalRange,temperature,initialRange, nameContainer)
  {
    this.data.push({
      labels: labels,
      id: nameContainer,
      airWaybillTemperatureControlPharmaCoolCare: this.airWaybillTemperatureControlPharmaCoolCare,
      datasets: [
        {
          label: 'Min. Temp',
          data: finalRange,
          fill: false,
          borderColor: '#DA291C'
        },
        {
          label: 'Monitoring temp',
          data: temperature,
          fill: false,
          borderColor: '#4dbd74'
        },
        {
          label: 'Max. Temp',
          data: initialRange,
          fill: false,
          borderColor: '#DA291C'
        },
        {
          label: '',
          data: [initialRange],
          fill: false,
          borderColor: '#0000ff00'
        }
      ]
    });
    this.options = {
      title: {
          display: true,
          text: 'Temperature',
          fontSize: 16
      },
      legend: {
          position: 'top'
      }
    };
  }

  exportTrackAwb() {
    this.submitted = true;
    this.loading = true;

    // stop here if airlineform is invalid
    if (this.trackAwbForm.invalid) {
      this.loading = false;
      this.messageService.add({
        severity: "warn",
        summary: "Emportacion de archivo",
        detail: "No existe datos para exportar",
        life: 8000,
      });
      return;
    }

    let workbook = new Workbook();
    let worksheet = workbook.addWorksheet('TrackAwb');
    const title = 'MONITORING REPORT || Avianca Cargo';
    const header = ['Product', 'AWB', 'Origin', 'Destination', 'SHC', 'Pieces', 'WT', 'Agent', 'Manifest desc', 'shipping status']
    const principalLeg = [];
    this.airWaybillsPrincipal.forEach(i => {
      principalLeg.push([i.productTypeId == 1 ? "Pharma Care" : "Pharma Cool Care", i.docNum, i.originRedStationName, i.destinyRedStationName, i.shc, i.pieces, i.weight, i.agent, i.manifestDesc, i.mvtSt]);
    });

    const data = principalLeg;
    worksheet.addRow([]);
    worksheet.addRow([]);
    worksheet.addRow([]);
    const titleRow = worksheet.addRow([title]);
    titleRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' },
        bgColor: { argb: 'FFFF0000' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    titleRow.font = { color : { argb :'FFFFFF'} };
    titleRow.alignment = {horizontal:'center'};
    worksheet.mergeCells('A4:J4');
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
    headerRow.font = { color : { argb :'FFFFFF'} };

    data.forEach(d => {
      const row = worksheet.addRow(d);
    });

    worksheet.addRow([]);
    worksheet.addRow([]);
    const headerItineraries = ['Carrier', 'Flight number', 'Origin leg', 'Destination leg', 'Date', 'Status Mvt']
    const headerItinerariesRow = worksheet.addRow(headerItineraries);
    headerItinerariesRow.eachCell((cell, number) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFFF0000' },
        bgColor: { argb: 'FFFF0000' }
      };
      cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });
    headerItinerariesRow.font = { color : { argb :'FFFFFF'} };

    const itineraries = [];

    this.airWaybillItineraries.forEach(i => {
      itineraries.push([i.carrier, i.fitNum, i.brdPtStationName, i.offPtStationName, this.datePipe.transform(i.date, 'mediumDate'), i.mvtSt]);
    });

    const dataItineraries = itineraries;
    dataItineraries.forEach(d => {
      const row = worksheet.addRow(d);
    });

    var htmlLogo = document.getElementById("imgPharmasite");

    html2canvas(htmlLogo).then(canvas => {
      var contentDataURL = canvas.toDataURL('image/png', 1.0);

      var logo = workbook.addImage({
        base64: contentDataURL,
        extension: 'jpeg',
      });

      worksheet.addImage(logo, "A1:C3");

          // Registros PharmaCare:
    if (this.showProduct === 'PharmaCare') {
      // Insertar grafica:
      var graphHeight = 15;
      var lastRow = worksheet.dimensions.bottom;
      var range = "A" + (lastRow + 2) + ":J" + (lastRow + graphHeight);
      var html = document.getElementById("graphPharmaCare");

      html2canvas(html).then(canvas => {
        var contentDataURL = canvas.toDataURL('image/png', 1.0);

        var logo = workbook.addImage({
          base64: contentDataURL,
          extension: 'jpeg',
        });

        worksheet.addImage(logo, range);

        for (let i = 0; i <= 15; i++) {
          worksheet.addRow([]);
        }

        const headerTemperature = ['Station', 'Status', 'Current Temp.', 'Temperature Range', 'Remark', 'User', 'Local time']
        const headerTemperatureRow = worksheet.addRow(headerTemperature);
        headerTemperatureRow.eachCell((cell, number) => {
          cell.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: 'FFFF0000' },
            bgColor: { argb: 'FFFF0000' }
          };
          cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
        });
        headerTemperatureRow.font = { color : { argb :'FFFFFF'} };

        const temperatureControls = [];

        this.airWaybillTemperatureControlsPharmaCare.forEach(i => {
          temperatureControls.push([i.stationName, i.statusName, i.temperature, `${i.initialRange} - ${i.finalRange}`, i.comments, i.userName, moment(i.createdDate).format("YYYY-MM-DD HH:mm")]);
          // temperatureControls.push([i.stationName, i.statusName, i.temperature, i.initialRange, i.finalRange, i.comments, i.userName, this.datePipe.transform(i.createdDate, 'long')]);
        });

        const dataTemperatureControls = temperatureControls;
        dataTemperatureControls.forEach(d => {
          const row = worksheet.addRow(d);
          /*const qty = row.getCell(5);
          let color = 'FF99FF99';
          if (+qty.value < 500) {
            color = 'FF9999';
          }
          qty.fill = {
            type: 'pattern',
            pattern: 'solid',
            fgColor: { argb: color }
          };*/
        });

        worksheet.getColumn(3).width = 30;
        worksheet.getColumn(4).width = 30;
        worksheet.addRow([]);
        workbook.xlsx.writeBuffer().then((data) => {
          let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          fs.saveAs(blob, 'Track_AWB.xlsx');
        })
      });
    }

    // Registros PharmaCoolCare:
    if (this.showProduct === 'PharmaCoolCare') {
      let cont = 0;

      this.containers.forEach((pcc) => {
        var html2 = document.getElementById(pcc);
        const graphHeight = 16;
        html2canvas(html2).then(canvas => {
          cont++;
          this.contentDataURL = canvas.toDataURL('image/png', 1.0);

          // Insertar grafica:
          worksheet.addRow([]);
          var lastRow = worksheet.dimensions.bottom;
          var range = "A" + (lastRow + 3) + ":J" + (lastRow + graphHeight);

          this.imageId = workbook.addImage({
            base64: this.contentDataURL,
            extension: 'jpeg',
          });

          worksheet.addImage(this.imageId, range);

          for (let i = 0; i < graphHeight; i++) {
            worksheet.addRow([]);
          }

          let titleContainerRow = worksheet.addRow([pcc]);
          titleContainerRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };
          const headerTemperaturePcc = ['Station', 'Status', 'Current Temp.', 'Temperature Range', 'Battery voltage', 'User', 'Local time']
          const headerTemperaturePccRow = worksheet.addRow(headerTemperaturePcc);
          headerTemperaturePccRow.eachCell((cell, number) => {
            cell.fill = {
              type: 'pattern',
              pattern: 'solid',
              fgColor: { argb: 'FFFF0000' },
              bgColor: { argb: 'FFFF0000' }
            };
            cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
          });

          headerTemperaturePccRow.font = { color : { argb :'FFFFFF'} };

          const temperatureControlsPcc = [];

          this.airWaybillTemperatureControlPharmaCoolCare=this.airWaybillTemperatureControlPharmaCoolCareAllContainers.filter(val => val.nameContainer === pcc);
          this.airWaybillTemperatureControlPharmaCoolCare.forEach(i => {
            let monitoringTime = i.statusId == 3 ? " (" + i.monitoringHour + ")" : "";
            
            temperatureControlsPcc.push([i.stationName, i.status + monitoringTime, i.currentTemperature, `${i.minTemperature} - ${i.maxTemperature}`, i.battVoltage, i.userName, moment(i.createdDate).format("YYYY-MM-DD HH:mm")]);
            // temperatureControlsPcc.push([i.stationName, i.status + monitoringTime, i.currentTemperature, i.minTemperature, i.maxTemperature, i.battVoltage, i.userName, this.datePipe.transform(i.createdDate, 'long')]);
          });

          const dataTemperatureControls = temperatureControlsPcc;
          dataTemperatureControls.forEach(d => {
            const row = worksheet.addRow(d);
          });
          
          worksheet.getColumn(3).width = 30;
          worksheet.getColumn(4).width = 30;

          if (this.containers.length == cont) {
            workbook.xlsx.writeBuffer().then((data) => {
              let blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
              fs.saveAs(blob, 'Track_AWB.xlsx');
            })
          }
        });
      });
    }
    })




    /*this.transactionService
    .GetList(this.constantService.WAYBILL_TRACK_AWB_URL + "/ExportFileToExcel/",this.searchTrackAwb.airWaybill)
    .subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          let file = new Blob([data.businessDto[0]], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          var fileURL = URL.createObjectURL(file);
          window.open(fileURL);

          this.airWaybillTemperatureControls = data.businessDto;
          this.totalRecords = data.totalRecords;
        } else {
          this.messageService.add({
            severity: "warn",
            summary: "Fecha",
            detail: data.responseDto.message,
            life: 8000,
          });
        }
      },
      (error) => {
        this.messageService.add({
          severity: "error",
          summary: "Por favor, intente nuevamente.",
          detail: "Por favor, intente más tarde.",
        });
      }
    );*/
  }

  exportPdf() {
    // Preparar encabezado y datos de pierna principal
    const headerPrincipalLeg = [[
      this.translateService.instant('module.trackAwb.productId', 'productId'),
      this.translateService.instant('module.trackAwb.airWaybill', 'airWaybill'),
      this.translateService.instant('module.trackAwb.originRedStationId', 'originRedStationId'),
      this.translateService.instant('module.trackAwb.destinyRedStationId', 'destinyRedStationId'),
      this.translateService.instant('module.trackAwb.sch', 'sch'),
      this.translateService.instant('module.trackAwb.pieces', 'pieces'),
      this.translateService.instant('module.trackAwb.weigtht', 'weigtht'),
      this.translateService.instant('module.trackAwb.agent', 'agent'),
      this.translateService.instant('module.trackAwb.manifiestDesc', 'manifiestDesc'),
      this.translateService.instant('module.trackAwb.shipmentStatus', 'shipmentStatus'),
    ]];

    const principalLeg = [];

    this.airWaybillsPrincipal.forEach(i => {
      principalLeg.push([
        i.productTypeId === 1 ? 'Pharma Care' : 'Pharma Cool Care',
        i.docNum,
        i.originRedStationName,
        i.destinyRedStationName,
        i.shc,
        i.pieces,
        i.weight,
        i.agent,
        i.manifestDesc,
        i.mvtSt
      ]);
    });

    const dataPrincipalLeg = principalLeg;

    // Preparar encabezado y datos de itinerarios:
    const headerItineraries = [[
      this.translateService.instant('module.trackAwb.itinerary.airlineId', 'airlineId'),
      this.translateService.instant('module.trackAwb.itinerary.fitNum', 'fitNum'),
      this.translateService.instant('module.trackAwb.itinerary.brdPtStationId', 'brdPtStationId'),
      this.translateService.instant('module.trackAwb.itinerary.offPtStationId', 'offPtStationId'),
      this.translateService.instant('module.trackAwb.itinerary.date', 'date'),
      this.translateService.instant('module.trackAwb.itinerary.mvtSt', 'mvtSt')
    ]];

    const itineraries = [];
    let numberItineraries = 0;

    this.airWaybillItineraries.forEach(i => {
      itineraries.push([
        i.carrier,
        i.fitNum,
        i.brdPtStationName,
        i.offPtStationName,
        this.datePipe.transform(i.date, 'mediumDate'),
        i.mvtSt
      ]);

      numberItineraries++;
    });

    const dataItineraries = itineraries;

    // Armar PDF para Pharma Care
    if (this.showProduct === 'PharmaCare') {
      const doc = new jspdf();
      const html = document.getElementById('graphPharmaCare');

      html2canvas(html).then(canvas => {
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();
        let lastRow = 12;

        doc.text(this.translateService.instant('module.trackAwb.titlePdf', 'titlePdf'), pageWidth / 2, lastRow, { align: 'center' });

        lastRow = lastRow + 8;

        (doc as any).autoTable({
          headStyles: { fillColor: [255, 0, 0], fontSize: 8, halign: 'center' },
          bodyStyles: { fontSize: 8 },
          head: headerPrincipalLeg,
          body: dataPrincipalLeg,
          theme: 'grid',
          startY: lastRow
        });

        lastRow = lastRow + 30;

        (doc as any).autoTable({
          headStyles: { fillColor: [255, 0, 0], fontSize: 8, halign: 'center' },
          bodyStyles: { fontSize: 8 },
          head: headerItineraries,
          body: dataItineraries,
          theme: 'grid',
          startY: lastRow
        });

        // Insertar grafica
        lastRow = lastRow + (numberItineraries * 10);
        const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
        const width = doc.internal.pageSize.getWidth();
        doc.addImage(contentDataURL, 'PNG', 4, lastRow, width, 0);

        // Tabla de control de temperatura
        const headerTemperature = [[
          this.translateService.instant('module.trackAwb.temperatureControl.stationId', 'stationId'),
          this.translateService.instant('module.trackAwb.temperatureControl.statusId', 'statusId'),
          this.translateService.instant('module.trackAwb.temperatureControl.currentTemp', 'currentTemp'),
          this.translateService.instant('module.trackAwb.temperatureControl.RangeTemp', 'RangeTemp'),
          this.translateService.instant('module.trackAwb.temperatureControl.comments', 'comments'),
          this.translateService.instant('module.trackAwb.temperatureControl.userId', 'userId'),
          this.translateService.instant('module.trackAwb.temperatureControl.date', 'date')
        ]];

        const temperatureControls = [];

        this.airWaybillTemperatureControlsPharmaCare.forEach(i => {
          temperatureControls.push([
            i.stationName,
            i.statusName,
            i.temperature,
            `${i.initialRange} - ${i.finalRange}`,
            i.comments,
            i.userName,
            moment(i.createdDate).format('YYYY-MM-DD HH:mm')]);
        });

        const dataTemperatureControls = temperatureControls;
        lastRow = lastRow + 70;

        (doc as any).autoTable({
          headStyles: { fillColor: [255, 0, 0], fontSize: 8, halign: 'center' },
          bodyStyles: { fontSize: 8 },
          head: headerTemperature,
          body: dataTemperatureControls,
          theme: 'grid',
          startY: lastRow
        });

        // Abrir documento PDF en una nueva pestaña
        // doc.output('dataurlnewwindow');

        // Descargar el documento PDF
        doc.save('Track_AWB.pdf');
      });
    }

    // Armar PDF para Pharma CoolCare
    if (this.showProduct === 'PharmaCoolCare') {
      const doc = new jspdf();
      let cont = 0;
      let lastRow = 12;
      const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

      doc.text(this.translateService.instant('module.trackAwb.titlePdf', 'titlePdf'), pageWidth / 2, lastRow, { align: 'center' });

      lastRow = lastRow + 8;

      (doc as any).autoTable({
        headStyles: { fillColor: [255, 0, 0], fontSize: 8, halign: 'center' },
        bodyStyles: { fontSize: 8 },
        head: headerPrincipalLeg,
        body: dataPrincipalLeg,
        theme: 'grid',
        startY: lastRow
      });

      lastRow = lastRow + 30;

      (doc as any).autoTable({
        headStyles: { fillColor: [255, 0, 0], fontSize: 8, halign: 'center' },
        bodyStyles: { fontSize: 8 },
        head: headerItineraries,
        body: dataItineraries,
        theme: 'grid',
        startY: lastRow
      });

      this.containers.forEach((pcc) => {
        const html2 = document.getElementById(pcc);
        const graphHeight = 16;
        html2canvas(html2).then(canvas => {
          cont++;
          this.contentDataURL = canvas.toDataURL('image/png', 1.0);

          // Alistar tabla de temperatura
          const headerTemperaturePcc = [[
            this.translateService.instant('module.trackAwb.temperatureControl.stationId', 'stationId'),
            this.translateService.instant('module.trackAwb.temperatureControl.statusId', 'statusId'),
            this.translateService.instant('module.trackAwb.temperatureControl.currentTemp', 'currentTemp'),
            this.translateService.instant('module.trackAwb.temperatureControl.RangeTemp', 'RangeTemp'),
            this.translateService.instant('module.trackAwb.temperatureControl.voltageBateria', 'voltageBateria'),
            this.translateService.instant('module.trackAwb.temperatureControl.userId', 'userId'),
            this.translateService.instant('module.trackAwb.temperatureControl.date', 'date')
          ]];

          const temperatureControlsPcc = [];

          this.airWaybillTemperatureControlPharmaCoolCare = this.airWaybillTemperatureControlPharmaCoolCareAllContainers.filter(
            val => val.nameContainer === pcc
          );

          this.airWaybillTemperatureControlPharmaCoolCare.forEach(i => {
            const monitoringTime = i.statusId === 3 ? ' (' + i.monitoringHour + ')' : '';
            temperatureControlsPcc.push([
              i.stationName,
              i.status + monitoringTime,
              i.currentTemperature,
              `${i.minTemperature} - ${i.maxTemperature}`,
              i.battVoltage,
              i.userName,
              moment(i.createdDate).format('YYYY-MM-DD HH:mm')
            ]);
          });

          const dataTemperatureControls = temperatureControlsPcc;

          // Insertar grafica
          if (numberItineraries > 0) {
            lastRow = lastRow + (numberItineraries * 20);
            numberItineraries = 0;
          } else {
            lastRow = lastRow + (this.airWaybillTemperatureControlPharmaCoolCare.length * 20);
          }

          const contentDataURL = canvas.toDataURL('image/jpeg', 1.0);
          const width = doc.internal.pageSize.getWidth();

          if (lastRow > 225) {
            doc.addPage();
            lastRow = 14;
          }

          doc.addImage(contentDataURL, 'PNG', 4, lastRow, width, 0, undefined, 'FAST');

          // Inserta tabla de temperatura:
          lastRow = lastRow + 70;

          (doc as any).autoTable({
            headStyles: { fillColor: [255, 0, 0], fontSize: 8, halign: 'center' },
            bodyStyles: { fontSize: 8 },
            head: headerTemperaturePcc,
            body: dataTemperatureControls,
            theme: 'grid',
            startY: lastRow
          });

          if (this.containers.length === cont) {
            // Abrir documento PDF en una nueva pestaña
            // doc.output('dataurlnewwindow');

            // Descargar el documento PDF
            doc.save('Track_AWB.pdf');
          }
        });
      });
    }
  }
}
