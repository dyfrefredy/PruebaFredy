import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfigurationsTableComponent } from './configurations-table.component';

describe('ConfigurationsTableComponent', () => {
  let component: ConfigurationsTableComponent;
  let fixture: ComponentFixture<ConfigurationsTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfigurationsTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfigurationsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
