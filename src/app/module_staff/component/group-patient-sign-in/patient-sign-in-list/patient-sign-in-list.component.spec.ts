import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientSignInListComponent} from './patient-sign-in-list.component';

describe('PatientSignInListComponent', () => {
  let component: PatientSignInListComponent;
  let fixture: ComponentFixture<PatientSignInListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSignInListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignInListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
