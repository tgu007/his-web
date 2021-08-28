import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientFeeListComponent} from './patient-fee-list.component';

describe('PatientManualFeeComponent', () => {
  let component: PatientFeeListComponent;
  let fixture: ComponentFixture<PatientFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientFeeListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
