import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PatientDetailContactComponent} from './patient-detail-contact.component';

describe('PatientDetailContactComponent', () => {
  let component: PatientDetailContactComponent;
  let fixture: ComponentFixture<PatientDetailContactComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PatientDetailContactComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatientDetailContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
