import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TempRecordListComponent} from './temp-record-list.component';

describe('TempRecordListComponent', () => {
  let component: TempRecordListComponent;
  let fixture: ComponentFixture<TempRecordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempRecordListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
