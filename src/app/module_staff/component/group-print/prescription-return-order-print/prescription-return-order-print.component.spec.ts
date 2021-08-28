import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionReturnOrderPrintComponent } from './prescription-return-order-print.component';

describe('PrescriptionReturnOrderPrintComponent', () => {
  let component: PrescriptionReturnOrderPrintComponent;
  let fixture: ComponentFixture<PrescriptionReturnOrderPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionReturnOrderPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionReturnOrderPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
