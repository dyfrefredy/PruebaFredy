import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-guide-master-sender',
  templateUrl: './guide-master-sender.component.html',
  styleUrls: ['./guide-master-sender.component.css']
})
export class GuideMasterSenderComponent implements OnInit {
  submitted: boolean;
  guideMasterSenderForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.guideMasterSenderForm = this.fb.group({
      businessName: ['', Validators.required],
      documentType: ['', Validators.required],
      documentNumber: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.submitted = false;
  }
  get f() {
    return this.guideMasterSenderForm.controls;
  }
}
