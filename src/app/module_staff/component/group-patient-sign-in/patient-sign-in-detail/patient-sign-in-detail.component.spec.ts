import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientSignInDetailComponent} from './patient-sign-in-detail.component';

describe('NewSignInComponent', () => {
  let component: PatientSignInDetailComponent;
  let fixture: ComponentFixture<PatientSignInDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSignInDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignInDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
