import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementPaymentRequestComponent } from './settlement-payment-request.component';

describe('SettlementPaymentRequestComponent', () => {
  let component: SettlementPaymentRequestComponent;
  let fixture: ComponentFixture<SettlementPaymentRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementPaymentRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementPaymentRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
