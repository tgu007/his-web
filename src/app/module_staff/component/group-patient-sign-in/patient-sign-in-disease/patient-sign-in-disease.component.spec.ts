import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientSignInDiseaseComponent} from './patient-sign-in-disease.component';

describe('PatientSignInDiseaseComponent', () => {
  let component: PatientSignInDiseaseComponent;
  let fixture: ComponentFixture<PatientSignInDiseaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSignInDiseaseComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignInDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
