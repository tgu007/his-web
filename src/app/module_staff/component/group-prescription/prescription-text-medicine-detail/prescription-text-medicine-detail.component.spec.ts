import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionTextMedicineDetailComponent} from './prescription-text-medicine-detail.component';

describe('PrescriptionNewTextMedicineComponent', () => {
  let component: PrescriptionTextMedicineDetailComponent;
  let fixture: ComponentFixture<PrescriptionTextMedicineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionTextMedicineDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionTextMedicineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
