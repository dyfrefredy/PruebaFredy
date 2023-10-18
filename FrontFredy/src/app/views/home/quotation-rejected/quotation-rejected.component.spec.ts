import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationRejectedComponent } from './quotation-rejected.component';

describe('QuotationRejectedComponent', () => {
  let component: QuotationRejectedComponent;
  let fixture: ComponentFixture<QuotationRejectedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationRejectedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationRejectedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
