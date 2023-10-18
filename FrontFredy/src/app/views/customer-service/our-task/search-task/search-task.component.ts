import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'search-task',
  templateUrl: './search-task.component.html',
  styleUrls: ['./search-task.component.css']
})
export class SearchTaskComponent implements OnInit {

  @Input() comeRole: Boolean = true;
  constructor() { }

  ngOnInit(): void {
  }

}
