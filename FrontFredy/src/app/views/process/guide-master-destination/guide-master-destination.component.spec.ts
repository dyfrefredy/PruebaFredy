import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMasterDestinationComponent } from './guide-master-destination.component';

describe('GuideMasterDestinationComponent', () => {
  let component: GuideMasterDestinationComponent;
  let fixture: ComponentFixture<GuideMasterDestinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMasterDestinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMasterDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
