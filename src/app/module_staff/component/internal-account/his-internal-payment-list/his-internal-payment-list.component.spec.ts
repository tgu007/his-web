import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HisInternalPaymentListComponent } from './his-internal-payment-list.component';

describe('HisInternalPaymentListComponent', () => {
  let component: HisInternalPaymentListComponent;
  let fixture: ComponentFixture<HisInternalPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HisInternalPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HisInternalPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
