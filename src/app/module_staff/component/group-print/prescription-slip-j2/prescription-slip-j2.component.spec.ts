import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionSlipJ2Component } from './prescription-slip-j2.component';

describe('PrescriptionSlipJ2Component', () => {
  let component: PrescriptionSlipJ2Component;
  let fixture: ComponentFixture<PrescriptionSlipJ2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionSlipJ2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionSlipJ2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
