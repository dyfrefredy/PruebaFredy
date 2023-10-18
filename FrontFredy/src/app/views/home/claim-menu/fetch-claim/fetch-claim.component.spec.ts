import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FetchClaimComponent } from './fetch-claim.component';

describe('FetchClaimComponent', () => {
  let component: FetchClaimComponent;
  let fixture: ComponentFixture<FetchClaimComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FetchClaimComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FetchClaimComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
