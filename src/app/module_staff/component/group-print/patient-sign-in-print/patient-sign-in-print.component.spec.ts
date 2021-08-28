import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientSignInPrintComponent} from './patient-sign-in-print.component';

describe('PatientSignInPrintComponent', () => {
  let component: PatientSignInPrintComponent;
  let fixture: ComponentFixture<PatientSignInPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSignInPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignInPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
