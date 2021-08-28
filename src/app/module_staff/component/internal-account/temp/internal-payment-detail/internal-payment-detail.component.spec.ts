import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPaymentDetailComponent } from './internal-payment-detail.component';

describe('InternalPaymentDetailComponent', () => {
  let component: InternalPaymentDetailComponent;
  let fixture: ComponentFixture<InternalPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
