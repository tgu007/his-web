import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MedicalRecordTemplateDetailComponent} from './medical-record-template-detail.component';

describe('MedicialRecordTemplateDetailComponent', () => {
  let component: MedicalRecordTemplateDetailComponent;
  let fixture: ComponentFixture<MedicalRecordTemplateDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRecordTemplateDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordTemplateDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
