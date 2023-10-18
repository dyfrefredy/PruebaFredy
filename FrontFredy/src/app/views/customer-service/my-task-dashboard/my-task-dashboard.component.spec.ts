import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyTaskDashboardComponent } from './my-task-dashboard.component';

describe('MyTaskDashboardComponent', () => {
  let component: MyTaskDashboardComponent;
  let fixture: ComponentFixture<MyTaskDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyTaskDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyTaskDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
