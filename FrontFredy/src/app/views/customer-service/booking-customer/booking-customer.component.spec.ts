import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingCustomerComponent } from './booking-customer.component';

describe('BookingCustomerComponent', () => {
  let component: BookingCustomerComponent;
  let fixture: ComponentFixture<BookingCustomerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BookingCustomerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingCustomerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
