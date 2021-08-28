import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientAutoFeeListComponent} from './patient-auto-fee-list.component';

describe('PatientAutoFeeListComponent', () => {
  let component: PatientAutoFeeListComponent;
  let fixture: ComponentFixture<PatientAutoFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientAutoFeeListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientAutoFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
