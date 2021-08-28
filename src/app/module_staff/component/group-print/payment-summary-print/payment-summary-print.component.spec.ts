import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSummaryPrintComponent } from './payment-summary-print.component';

describe('PaymentSummaryPrintComponent', () => {
  let component: PaymentSummaryPrintComponent;
  let fixture: ComponentFixture<PaymentSummaryPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSummaryPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSummaryPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
