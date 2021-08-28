import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionMedicineDetailComponent} from './prescription-medicine-detail.component';

describe('PrescriptionNewMedicineComponent', () => {
  let component: PrescriptionMedicineDetailComponent;
  let fixture: ComponentFixture<PrescriptionMedicineDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionMedicineDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionMedicineDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
