import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionMedicinePendingOrderListComponent} from './prescription-medicine-pending-order-list.component';

describe('PrescriptionMedicinePendingOrderListComponent', () => {
  let component: PrescriptionMedicinePendingOrderListComponent;
  let fixture: ComponentFixture<PrescriptionMedicinePendingOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionMedicinePendingOrderListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionMedicinePendingOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
