import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientSignOutComponent} from './patient-sign-out.component';

describe('PatientSignOutComponent', () => {
  let component: PatientSignOutComponent;
  let fixture: ComponentFixture<PatientSignOutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientSignOutComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignOutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
