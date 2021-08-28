import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrgRecordOperationComponent } from './drg-record-operation.component';

describe('DrgRecordOperationComponent', () => {
  let component: DrgRecordOperationComponent;
  let fixture: ComponentFixture<DrgRecordOperationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrgRecordOperationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrgRecordOperationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
