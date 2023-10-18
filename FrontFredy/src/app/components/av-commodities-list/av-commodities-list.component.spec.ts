import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvCommoditiesListComponent } from './av-commodities-list.component';

describe('AvCommoditiesListComponent', () => {
  let component: AvCommoditiesListComponent;
  let fixture: ComponentFixture<AvCommoditiesListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvCommoditiesListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvCommoditiesListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
