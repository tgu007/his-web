import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorAgreementComponent } from './doctor-agreement.component';

describe('DoctorAgreementComponent', () => {
  let component: DoctorAgreementComponent;
  let fixture: ComponentFixture<DoctorAgreementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DoctorAgreementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorAgreementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
