import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionMedicineOrderProcessedListSummaryComponent} from './prescription-medicine-order-processed-list-summary.component';

describe('PrescriptionMedicinePendingReturnOrderListComponent', () => {
  let component: PrescriptionMedicineOrderProcessedListSummaryComponent;
  let fixture: ComponentFixture<PrescriptionMedicineOrderProcessedListSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionMedicineOrderProcessedListSummaryComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionMedicineOrderProcessedListSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
