import { async, ComponentFixture, TestBed } from '@angular/core/testing';


import { GuideNotifyComponent } from './guide-notify.component';

describe('GuideNotifyComponent', () => {
  let component: GuideNotifyComponent;
  let fixture: ComponentFixture<GuideNotifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideNotifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideNotifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
