import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMaterDetailComponent } from './guide-master-detail.component';

describe('GuideDetalleComponent', () => {
  let component: GuideMaterDetailComponent;
  let fixture: ComponentFixture<GuideMaterDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMaterDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMaterDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
