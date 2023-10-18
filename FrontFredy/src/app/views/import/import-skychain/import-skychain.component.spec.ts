import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportSkychainComponent } from './import-skychain.component';

describe('ImportSkychainComponent', () => {
  let component: ImportSkychainComponent;
  let fixture: ComponentFixture<ImportSkychainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportSkychainComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportSkychainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
