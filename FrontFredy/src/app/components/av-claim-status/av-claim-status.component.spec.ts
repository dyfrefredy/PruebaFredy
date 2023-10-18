import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvClaimStatusComponent } from './av-claim-status.component';

describe('AvClaimStatusComponent', () => {
  let component: AvClaimStatusComponent;
  let fixture: ComponentFixture<AvClaimStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvClaimStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvClaimStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
