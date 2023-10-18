import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocumentsDeliveryComponent } from './documents-delivery.component';

describe('DocumentsDeliveryComponent', () => {
  let component: DocumentsDeliveryComponent;
  let fixture: ComponentFixture<DocumentsDeliveryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocumentsDeliveryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentsDeliveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
