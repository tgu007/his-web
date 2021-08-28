import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionMedicineUsageComponent } from './prescription-medicine-usage.component';

describe('PrescriptionMedicineUsageComponent', () => {
  let component: PrescriptionMedicineUsageComponent;
  let fixture: ComponentFixture<PrescriptionMedicineUsageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionMedicineUsageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionMedicineUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
