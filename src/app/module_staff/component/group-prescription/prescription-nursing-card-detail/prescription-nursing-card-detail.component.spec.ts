import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionNursingCardDetailComponent} from './prescription-nursing-card-detail.component';

describe('PrescriptionMedicineCardDetailComponent', () => {
  let component: PrescriptionNursingCardDetailComponent;
  let fixture: ComponentFixture<PrescriptionNursingCardDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionNursingCardDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionNursingCardDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
