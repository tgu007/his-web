import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NursingRecordListComponent} from './nursing-record-list.component';

describe('NursingRecordListComponent', () => {
  let component: NursingRecordListComponent;
  let fixture: ComponentFixture<NursingRecordListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NursingRecordListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingRecordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
