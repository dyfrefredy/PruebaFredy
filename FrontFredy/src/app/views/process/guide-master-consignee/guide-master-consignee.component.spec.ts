import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMasterConsigneeComponent } from './guide-master-consignee.component';

describe('GuideMasterConsigneeComponent', () => {
  let component: GuideMasterConsigneeComponent;
  let fixture: ComponentFixture<GuideMasterConsigneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMasterConsigneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMasterConsigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
