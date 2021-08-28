import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PendingExecutionPrescriptionPrintComponent } from './pending-execution-prescription-print.component';

describe('PendingExecutionPrescriptionPrintComponent', () => {
  let component: PendingExecutionPrescriptionPrintComponent;
  let fixture: ComponentFixture<PendingExecutionPrescriptionPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PendingExecutionPrescriptionPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PendingExecutionPrescriptionPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
