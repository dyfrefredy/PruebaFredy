import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomaticAssignmentsUserComponent } from './automatic-assignments-user.component';

describe('AutomaticAssignmentsUserComponent', () => {
  let component: AutomaticAssignmentsUserComponent;
  let fixture: ComponentFixture<AutomaticAssignmentsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AutomaticAssignmentsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomaticAssignmentsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
