import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-our-task',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  @Input() comeRole: Boolean = false;
  constructor() {  }

  ngOnInit(): void {
  }

}
