import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NursingRecordDetailComponent} from './nursing-record-detail.component';

describe('NursingRecordDetailComponent', () => {
  let component: NursingRecordDetailComponent;
  let fixture: ComponentFixture<NursingRecordDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NursingRecordDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingRecordDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
