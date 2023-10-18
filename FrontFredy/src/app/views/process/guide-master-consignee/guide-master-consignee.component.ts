import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-guide-master-consignee',
  templateUrl: './guide-master-consignee.component.html',
  styleUrls: ['./guide-master-consignee.component.css']
})
export class GuideMasterConsigneeComponent implements OnInit {
  submitted: boolean;
  guideMasterConsigneeForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.guideMasterConsigneeForm = this.fb.group({
      loadArrangement: ['', Validators.required],
      customs: ['', Validators.required],
      countryConsignee: ['', Validators.required],
      businessNameConsignee: ['', Validators.required],
      stateConsignee: ['', Validators.required],
      documentTypeConsignee: ['', Validators.required],
      documentNumberConsignee: ['', Validators.required],
      dv: ['', Validators.required],
      cityConsignee: ['', Validators.required],
      addressConsignee: ['', Validators.required],
      freeZone: ['', Validators.required],
      skychain: ['', Validators.required],
      flightNum: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.submitted = false;
  }
  get f() {
    return this.guideMasterConsigneeForm.controls;
  }
}
