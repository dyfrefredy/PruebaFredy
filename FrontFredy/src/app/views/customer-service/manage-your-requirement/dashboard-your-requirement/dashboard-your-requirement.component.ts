import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-your-requirement',
  templateUrl: './dashboard-your-requirement.component.html',
  styleUrls: ['./dashboard-your-requirement.component.css']
})
export class DashboardYourRequirementComponent implements OnInit {

  @Input() comeRole: Boolean = false;
  constructor() {  }

  ngOnInit(): void {
  }

}
