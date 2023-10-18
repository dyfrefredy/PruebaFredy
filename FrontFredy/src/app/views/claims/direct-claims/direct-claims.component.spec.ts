import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectClaimsComponent } from './direct-claims.component';

describe('DirectClaimsComponent', () => {
  let component: DirectClaimsComponent;
  let fixture: ComponentFixture<DirectClaimsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DirectClaimsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectClaimsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
