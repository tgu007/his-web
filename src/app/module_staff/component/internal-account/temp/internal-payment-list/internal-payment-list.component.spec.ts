import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalPaymentListComponent } from './internal-payment-list.component';

describe('InternalPaymentListComponent', () => {
  let component: InternalPaymentListComponent;
  let fixture: ComponentFixture<InternalPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalPaymentListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalPaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
