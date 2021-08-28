import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TempRecordTableListComponent} from './temp-record-table-list.component';

describe('TempRecordTableListComponent', () => {
  let component: TempRecordTableListComponent;
  let fixture: ComponentFixture<TempRecordTableListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TempRecordTableListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TempRecordTableListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
