import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TempRecordDetailComponent} from './temp-record-detail.component';

describe('TempRecordDetailComponent', () => {
  let component: TempRecordDetailComponent;
  let fixture: ComponentFixture<TempRecordDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempRecordDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
