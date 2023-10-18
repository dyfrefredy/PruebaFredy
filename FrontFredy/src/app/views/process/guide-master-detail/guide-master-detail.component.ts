import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-guide-master-detail',
  templateUrl: './guide-master-detail.component.html',
  styleUrls: ['./guide-master-detail.component.css']
})
export class GuideMaterDetailComponent implements OnInit {
  submitted: boolean;
  guideMasterDetailForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.guideMasterDetailForm = this.fb.group({
      skychain: ['', Validators.required],
      travelDocumentType: ['', Validators.required],
      adminCode: ['', Validators.required],
      shippingCountry: ['', Validators.required],
      shippingPlaceCode: ['', Validators.required],
      numberChildDocs: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.submitted = false;
  }
  get f() {
    return this.guideMasterDetailForm.controls;
  }
}
