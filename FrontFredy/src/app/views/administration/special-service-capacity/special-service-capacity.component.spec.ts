import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialServiceCapacityComponent } from './special-service-capacity.component';

describe('SpecialServiceCapacityComponent', () => {
  let component: SpecialServiceCapacityComponent;
  let fixture: ComponentFixture<SpecialServiceCapacityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialServiceCapacityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialServiceCapacityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
