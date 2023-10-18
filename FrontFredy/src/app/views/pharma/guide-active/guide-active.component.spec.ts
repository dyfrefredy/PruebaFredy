import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideActiveComponent } from './guide-active.component';

describe('GuideActiveComponent', () => {
  let component: GuideActiveComponent;
  let fixture: ComponentFixture<GuideActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
