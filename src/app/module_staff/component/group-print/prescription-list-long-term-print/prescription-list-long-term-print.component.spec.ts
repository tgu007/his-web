import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionListLongTermPrintComponent } from './prescription-list-long-term-print.component';

describe('PrescriptionListLongTermPrintComponent', () => {
  let component: PrescriptionListLongTermPrintComponent;
  let fixture: ComponentFixture<PrescriptionListLongTermPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionListLongTermPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionListLongTermPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
