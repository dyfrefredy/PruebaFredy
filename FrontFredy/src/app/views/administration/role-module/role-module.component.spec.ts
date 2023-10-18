import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoleModuleComponent } from './role-module.component';

describe('RoleModuleComponent', () => {
  let component: RoleModuleComponent;
  let fixture: ComponentFixture<RoleModuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoleModuleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoleModuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
