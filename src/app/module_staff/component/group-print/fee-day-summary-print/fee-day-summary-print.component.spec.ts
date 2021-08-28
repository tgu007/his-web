import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDaySummaryPrintComponent } from './fee-day-summary-print.component';

describe('FeeDaySummaryPrintComponent', () => {
  let component: FeeDaySummaryPrintComponent;
  let fixture: ComponentFixture<FeeDaySummaryPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeDaySummaryPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDaySummaryPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
