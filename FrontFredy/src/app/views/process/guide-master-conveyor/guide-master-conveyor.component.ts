import { Component, OnInit } from '@angular/core';
import { Validators } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-guide-master-conveyor',
  templateUrl: './guide-master-conveyor.component.html',
  styleUrls: ['./guide-master-conveyor.component.css']
})
export class GuideMasterConveyorComponent implements OnInit {
  submitted: boolean;
  guideMasterConveyorForm: FormGroup;
  constructor(private fb: FormBuilder) {
    this.guideMasterConveyorForm = this.fb.group({
      airlineId: ['', Validators.required],
      documentTypeConveyor: ['', Validators.required],
      nit: ['', Validators.required],
      dv: ['', Validators.required],
    });
   }

  ngOnInit(): void {
    this.submitted = false;
  }
  get f() {
    return this.guideMasterConveyorForm.controls;
  }

}
