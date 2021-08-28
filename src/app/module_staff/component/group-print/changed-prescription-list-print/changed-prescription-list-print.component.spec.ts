import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangedPrescriptionListPrintComponent } from './changed-prescription-list-print.component';

describe('ChangedPrescriptionListPrintComponent', () => {
  let component: ChangedPrescriptionListPrintComponent;
  let fixture: ComponentFixture<ChangedPrescriptionListPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangedPrescriptionListPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangedPrescriptionListPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
