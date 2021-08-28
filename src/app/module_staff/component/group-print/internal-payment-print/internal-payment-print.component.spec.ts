import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPaymentPrintComponent } from './internal-payment-print.component';

describe('InternalPaymentPrintComponent', () => {
  let component: InternalPaymentPrintComponent;
  let fixture: ComponentFixture<InternalPaymentPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalPaymentPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalPaymentPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
