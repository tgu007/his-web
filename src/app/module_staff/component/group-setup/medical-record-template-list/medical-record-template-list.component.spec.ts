import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MedicalRecordTemplateListComponent} from './medical-record-template-list.component';

describe('MedicalRecordTemplateListComponent', () => {
  let component: MedicalRecordTemplateListComponent;
  let fixture: ComponentFixture<MedicalRecordTemplateListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicalRecordTemplateListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicalRecordTemplateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
