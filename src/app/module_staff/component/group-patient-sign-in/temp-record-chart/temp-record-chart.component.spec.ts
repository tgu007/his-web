import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TempRecordChartComponent} from './temp-record-chart.component';

describe('TempRecordChartComponent', () => {
  let component: TempRecordChartComponent;
  let fixture: ComponentFixture<TempRecordChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempRecordChartComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempRecordChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
