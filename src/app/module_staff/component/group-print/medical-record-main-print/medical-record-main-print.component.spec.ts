import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MedicalRecordMainPrintComponent} from './medical-record-main-print.component';

describe('MedicalRecordMainPrintComponent', () => {
  let component: MedicalRecordMainPrintComponent;
  let fixture: ComponentFixture<MedicalRecordMainPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRecordMainPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordMainPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
