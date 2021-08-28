import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionOrderSummaryPrintComponent } from './prescription-order-summary-print.component';

describe('PrescriptionOrderSummaryPrintComponent', () => {
  let component: PrescriptionOrderSummaryPrintComponent;
  let fixture: ComponentFixture<PrescriptionOrderSummaryPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionOrderSummaryPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionOrderSummaryPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
