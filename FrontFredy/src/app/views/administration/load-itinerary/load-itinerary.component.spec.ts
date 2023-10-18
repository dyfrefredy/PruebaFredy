import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadItineraryComponent } from './load-itinerary.component';

describe('LoadItineraryComponent', () => {
  let component: LoadItineraryComponent;
  let fixture: ComponentFixture<LoadItineraryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadItineraryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadItineraryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
