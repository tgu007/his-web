import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientFeeDetailComponent} from './patient-fee-detail.component';

describe('PatientManualFeeDetailComponent', () => {
  let component: PatientFeeDetailComponent;
  let fixture: ComponentFixture<PatientFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientFeeDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
