import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeSummaryListPrintComponent } from './fee-summary-list-print.component';

describe('FeeSummaryListPrintComponent', () => {
  let component: FeeSummaryListPrintComponent;
  let fixture: ComponentFixture<FeeSummaryListPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeSummaryListPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeSummaryListPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
