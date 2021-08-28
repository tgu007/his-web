import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrintSettlementPaymentRequestComponent } from './print-settlement-payment-request.component';

describe('PrintSettlementPaymentRequestComponent', () => {
  let component: PrintSettlementPaymentRequestComponent;
  let fixture: ComponentFixture<PrintSettlementPaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrintSettlementPaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrintSettlementPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
