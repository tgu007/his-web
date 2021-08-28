import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionMedicineOrderProcessedListComponent} from './prescription-medicine-order-processed-list.component';

describe('PrescriptionMedicineOrderHistoryListComponent', () => {
  let component: PrescriptionMedicineOrderProcessedListComponent;
  let fixture: ComponentFixture<PrescriptionMedicineOrderProcessedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionMedicineOrderProcessedListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionMedicineOrderProcessedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
