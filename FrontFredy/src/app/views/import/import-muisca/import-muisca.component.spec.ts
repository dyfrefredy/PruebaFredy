import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportMuiscaComponent } from './import-muisca.component';

describe('ImportMuiscaComponent', () => {
  let component: ImportMuiscaComponent;
  let fixture: ComponentFixture<ImportMuiscaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImportMuiscaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportMuiscaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
