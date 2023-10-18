import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AvCommoditiesComponent } from './av-commodities.component';

describe('AvCommoditiesComponent', () => {
  let component: AvCommoditiesComponent;
  let fixture: ComponentFixture<AvCommoditiesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AvCommoditiesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AvCommoditiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
