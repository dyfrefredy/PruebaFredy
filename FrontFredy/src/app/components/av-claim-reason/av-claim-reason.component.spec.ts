import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvClaimReasonComponent } from './av-claim-reason.component';

describe('AvClaimReasonComponent', () => {
  let component: AvClaimReasonComponent;
  let fixture: ComponentFixture<AvClaimReasonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvClaimReasonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvClaimReasonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
