import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TempRecordListBatchComponent} from './temp-record-list-batch.component';

describe('TempRecordListBatchComponent', () => {
  let component: TempRecordListBatchComponent;
  let fixture: ComponentFixture<TempRecordListBatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempRecordListBatchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempRecordListBatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
