import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HisInternalPaymentDetailComponent } from './his-internal-payment-detail.component';

describe('HisInternalPaymentDetailComponent', () => {
  let component: HisInternalPaymentDetailComponent;
  let fixture: ComponentFixture<HisInternalPaymentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HisInternalPaymentDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HisInternalPaymentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
