import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HisFeePaymentSummaryComponent } from './his-fee-payment-summary.component';

describe('HisFeePaymentSummaryComponent', () => {
  let component: HisFeePaymentSummaryComponent;
  let fixture: ComponentFixture<HisFeePaymentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HisFeePaymentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HisFeePaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
