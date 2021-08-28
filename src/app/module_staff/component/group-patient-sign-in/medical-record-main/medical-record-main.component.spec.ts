import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MedicalRecordMainComponent} from './medical-record-main.component';

describe('MedicalRecordMainComponent', () => {
  let component: MedicalRecordMainComponent;
  let fixture: ComponentFixture<MedicalRecordMainComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRecordMainComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
