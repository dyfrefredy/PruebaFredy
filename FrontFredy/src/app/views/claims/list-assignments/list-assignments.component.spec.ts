import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListAssignmentsComponent } from './list-assignments.component';

describe('ListAssignmentsComponent', () => {
  let component: ListAssignmentsComponent;
  let fixture: ComponentFixture<ListAssignmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListAssignmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListAssignmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
