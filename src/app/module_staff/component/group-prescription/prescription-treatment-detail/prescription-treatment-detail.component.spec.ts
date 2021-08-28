import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionTreatmentDetailComponent} from './prescription-treatment-detail.component';

describe('PrescriptionNewTreatmentComponent', () => {
  let component: PrescriptionTreatmentDetailComponent;
  let fixture: ComponentFixture<PrescriptionTreatmentDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionTreatmentDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionTreatmentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
