import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientSignInInfoComponent} from './patient-sign-in-info.component';

describe('PatientSignInDetailDisplayComponent', () => {
  let component: PatientSignInInfoComponent;
  let fixture: ComponentFixture<PatientSignInInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSignInInfoComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignInInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
