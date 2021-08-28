import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MedicalRecordTemplateTagComponent} from './medical-record-template-tag.component';

describe('MedicalRecordTemplateTagComponent', () => {
  let component: MedicalRecordTemplateTagComponent;
  let fixture: ComponentFixture<MedicalRecordTemplateTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRecordTemplateTagComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordTemplateTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
