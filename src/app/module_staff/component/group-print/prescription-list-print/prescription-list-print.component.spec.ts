import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionListPrintComponent} from './prescription-list-print.component';

describe('PrescriptionListPrintComponent', () => {
  let component: PrescriptionListPrintComponent;
  let fixture: ComponentFixture<PrescriptionListPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionListPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionListPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
