import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';

@Component({
  selector: 'app-guide-master-destination',
  templateUrl: './guide-master-destination.component.html',
  styleUrls: ['./guide-master-destination.component.css']
})
export class GuideMasterDestinationComponent implements OnInit {

  submitted: boolean;
  guideMasterDestinationForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.guideMasterDestinationForm = this.fb.group({
      countryDestination: ['', Validators.required],
      stateDestination: ['', Validators.required],
      cityDestination: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.submitted = false;
  }
  get f() {
    return this.guideMasterDestinationForm.controls;
  }
}
