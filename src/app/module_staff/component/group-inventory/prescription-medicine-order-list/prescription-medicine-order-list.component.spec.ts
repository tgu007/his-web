import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionMedicineOrderListComponent} from './prescription-medicine-order-list.component';

describe('PrescriptionMedicineOrderListComponent', () => {
  let component: PrescriptionMedicineOrderListComponent;
  let fixture: ComponentFixture<PrescriptionMedicineOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionMedicineOrderListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionMedicineOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
