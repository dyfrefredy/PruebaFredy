import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackAwbComponent } from './track-awb.component';

describe('TrackAwbComponent', () => {
  let component: TrackAwbComponent;
  let fixture: ComponentFixture<TrackAwbComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackAwbComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackAwbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
