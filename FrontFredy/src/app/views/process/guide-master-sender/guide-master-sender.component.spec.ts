import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMasterSenderComponent } from './guide-master-sender.component';

describe('GuideMasterSenderComponent', () => {
  let component: GuideMasterSenderComponent;
  let fixture: ComponentFixture<GuideMasterSenderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMasterSenderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMasterSenderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
