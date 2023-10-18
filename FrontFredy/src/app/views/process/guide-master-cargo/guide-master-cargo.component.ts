import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-guide-master-cargo',
  templateUrl: './guide-master-cargo.component.html',
  styleUrls: ['./guide-master-cargo.component.css']
})
export class GuideMasterCargoComponent implements OnInit {
  submitted: boolean;
  guideMasterCargoForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.guideMasterCargoForm = this.fb.group({
      cargoHandling: ['', Validators.required],
      cargoDescription: ['', Validators.required],
      skyccargoDescriptionhain: ['', Validators.required],
      totalPackagesPieces: ['', Validators.required],
      totalGrossWeightCargo: ['', Validators.required],
      totalCargoVolume: ['', Validators.required],
      travelDocumentNumber: ['', Validators.required],
      travelDocumentDate: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.submitted = false;
  }
  get f() {
    return this.guideMasterCargoForm.controls;
  }

}
