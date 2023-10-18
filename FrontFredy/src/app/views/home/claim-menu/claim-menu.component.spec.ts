import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaimMenuComponent } from './claim-menu.component';

describe('ClaimMenuComponent', () => {
  let component: ClaimMenuComponent;
  let fixture: ComponentFixture<ClaimMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClaimMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClaimMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
