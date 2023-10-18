import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageYourBookingComponent } from './manage-your-booking.component';

describe('MyBookingComponent', () => {
  let component: ManageYourBookingComponent;
  let fixture: ComponentFixture<ManageYourBookingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageYourBookingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageYourBookingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
