import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideAcceptanceComponent } from './guide-acceptance.component';

describe('GuideAcceptanceComponent', () => {
  let component: GuideAcceptanceComponent;
  let fixture: ComponentFixture<GuideAcceptanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideAcceptanceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideAcceptanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
