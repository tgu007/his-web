import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NursingRecordPrintComponent} from './nursing-record-print.component';

describe('NursingRecordPrintComponent', () => {
  let component: NursingRecordPrintComponent;
  let fixture: ComponentFixture<NursingRecordPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NursingRecordPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingRecordPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
