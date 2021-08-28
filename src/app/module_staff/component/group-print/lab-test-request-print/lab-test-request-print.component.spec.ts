import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabTestRequestPrintComponent } from './lab-test-request-print.component';

describe('LabTestRequestPrintComponent', () => {
  let component: LabTestRequestPrintComponent;
  let fixture: ComponentFixture<LabTestRequestPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabTestRequestPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabTestRequestPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
