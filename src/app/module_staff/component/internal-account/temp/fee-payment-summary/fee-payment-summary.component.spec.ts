import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeePaymentSummaryComponent } from './fee-payment-summary.component';

describe('FeePaymentSummaryComponent', () => {
  let component: FeePaymentSummaryComponent;
  let fixture: ComponentFixture<FeePaymentSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeePaymentSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeePaymentSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
