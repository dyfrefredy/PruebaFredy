import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMasterConveyorComponent } from './guide-master-conveyor.component';

describe('GuideMasterConveyorComponent', () => {
  let component: GuideMasterConveyorComponent;
  let fixture: ComponentFixture<GuideMasterConveyorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMasterConveyorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMasterConveyorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
