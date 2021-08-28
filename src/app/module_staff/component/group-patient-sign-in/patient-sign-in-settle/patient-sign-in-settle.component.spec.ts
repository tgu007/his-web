import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatientSignInSettleComponent } from './patient-sign-in-settle.component';

describe('PatientSignInSettleComponent', () => {
  let component: PatientSignInSettleComponent;
  let fixture: ComponentFixture<PatientSignInSettleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatientSignInSettleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientSignInSettleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', ()  => {
    expect(component).toBeTruthy();
  });
});
