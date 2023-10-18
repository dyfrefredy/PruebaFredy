import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportDian1166Component } from './import-dian-1166.component';

describe('ImportDian1166Component', () => {
  let component: ImportDian1166Component;
  let fixture: ComponentFixture<ImportDian1166Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportDian1166Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportDian1166Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
