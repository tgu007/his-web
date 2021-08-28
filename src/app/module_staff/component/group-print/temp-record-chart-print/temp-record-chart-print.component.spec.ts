import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TempRecordChartPrintComponent} from './temp-record-chart-print.component';

describe('TempRecordChartPrintComponent', () => {
  let component: TempRecordChartPrintComponent;
  let fixture: ComponentFixture<TempRecordChartPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempRecordChartPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempRecordChartPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
