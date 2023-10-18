import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DryIceSupplyComponent } from './dry-ice-supply.component';

describe('DryIceSupplyComponent', () => {
  let component: DryIceSupplyComponent;
  let fixture: ComponentFixture<DryIceSupplyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DryIceSupplyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DryIceSupplyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
