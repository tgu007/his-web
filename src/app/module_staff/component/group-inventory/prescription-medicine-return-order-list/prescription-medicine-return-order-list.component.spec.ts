import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionMedicineReturnOrderListComponent} from './prescription-medicine-return-order-list.component';

describe('PrescriptionMedicineReturnOrderListComponent', () => {
  let component: PrescriptionMedicineReturnOrderListComponent;
  let fixture: ComponentFixture<PrescriptionMedicineReturnOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionMedicineReturnOrderListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionMedicineReturnOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
