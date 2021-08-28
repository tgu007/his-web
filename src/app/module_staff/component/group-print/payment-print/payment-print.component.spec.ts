import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPrintComponent } from './payment-print.component';

describe('PaymentPrintComponent', () => {
  let component: PaymentPrintComponent;
  let fixture: ComponentFixture<PaymentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
