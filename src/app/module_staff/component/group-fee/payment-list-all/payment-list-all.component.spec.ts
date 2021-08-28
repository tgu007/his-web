import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListAllComponent } from './payment-list-all.component';

describe('PaymentListAllComponent', () => {
  let component: PaymentListAllComponent;
  let fixture: ComponentFixture<PaymentListAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentListAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
