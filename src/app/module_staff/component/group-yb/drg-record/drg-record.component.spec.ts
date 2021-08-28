import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrgRecordComponent } from './drg-record.component';

describe('DrgRecordComponent', () => {
  let component: DrgRecordComponent;
  let fixture: ComponentFixture<DrgRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrgRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrgRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
