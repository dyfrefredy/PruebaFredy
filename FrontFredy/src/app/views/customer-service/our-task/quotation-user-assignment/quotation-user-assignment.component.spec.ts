import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { QuotationUserAssignmentComponent } from './quotation-user-assignment.component';

describe('QuotationUserComponent', () => {
  let component: QuotationUserAssignmentComponent;
  let fixture: ComponentFixture<QuotationUserAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ QuotationUserAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuotationUserAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
