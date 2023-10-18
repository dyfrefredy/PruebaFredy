import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialServiceOperationComponent } from './special-service-operation.component';

describe('SpecialServiceOperationComponent', () => {
  let component: SpecialServiceOperationComponent;
  let fixture: ComponentFixture<SpecialServiceOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SpecialServiceOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecialServiceOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
