import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientSignInSelectComponent} from './patient-sign-in-select.component';

describe('PatientSignInSelectComponent', () => {
  let component: PatientSignInSelectComponent;
  let fixture: ComponentFixture<PatientSignInSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSignInSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignInSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
