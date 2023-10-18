import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuideMasterComponent } from './guide-master.component';

describe('GuideMasterComponent', () => {
  let component: GuideMasterComponent;
  let fixture: ComponentFixture<GuideMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GuideMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuideMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
