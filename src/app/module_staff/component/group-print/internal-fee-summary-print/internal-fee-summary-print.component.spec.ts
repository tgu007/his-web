import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalFeeSummaryPrintComponent } from './internal-fee-summary-print.component';

describe('InternalFeeSummaryPrintComponent', () => {
  let component: InternalFeeSummaryPrintComponent;
  let fixture: ComponentFixture<InternalFeeSummaryPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalFeeSummaryPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalFeeSummaryPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
