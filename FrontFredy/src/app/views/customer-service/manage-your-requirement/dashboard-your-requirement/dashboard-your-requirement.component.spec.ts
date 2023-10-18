import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardYourRequirementComponent } from './dashboard-your-requirement.component';

describe('DashboardComponent', () => {
  let component: DashboardYourRequirementComponent;
  let fixture: ComponentFixture<DashboardYourRequirementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DashboardYourRequirementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DashboardYourRequirementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
