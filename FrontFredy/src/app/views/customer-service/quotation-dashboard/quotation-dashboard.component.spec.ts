import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationDashboardComponent } from './quotation-dashboard.component';

describe('QuotationDashboardComponent', () => {
  let component: QuotationDashboardComponent;
  let fixture: ComponentFixture<QuotationDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
