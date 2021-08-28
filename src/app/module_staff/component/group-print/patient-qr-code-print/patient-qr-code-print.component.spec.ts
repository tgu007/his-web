import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientQrCodePrintComponent} from './patient-qr-code-print.component';

describe('PatientQrCodePrintComponent', () => {
  let component: PatientQrCodePrintComponent;
  let fixture: ComponentFixture<PatientQrCodePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientQrCodePrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientQrCodePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
