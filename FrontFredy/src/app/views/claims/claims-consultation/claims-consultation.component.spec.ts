import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimsConsultationComponent } from './claims-consultation.component';

describe('ClaimsConsultationComponent', () => {
  let component: ClaimsConsultationComponent;
  let fixture: ComponentFixture<ClaimsConsultationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimsConsultationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimsConsultationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
