import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicalRecordPrintComponent } from './medical-record-print.component';

describe('MedicalRecordPrintComponent', () => {
  let component: MedicalRecordPrintComponent;
  let fixture: ComponentFixture<MedicalRecordPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicalRecordPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
