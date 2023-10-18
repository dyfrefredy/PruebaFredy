import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMasterCargoComponent } from './guide-master-cargo.component';

describe('GuideMasterCargoComponent', () => {
  let component: GuideMasterCargoComponent;
  let fixture: ComponentFixture<GuideMasterCargoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMasterCargoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMasterCargoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
