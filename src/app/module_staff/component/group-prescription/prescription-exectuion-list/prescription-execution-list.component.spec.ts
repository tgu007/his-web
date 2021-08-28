import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionExecutionListComponent} from './prescription-execution-list.component';

describe('PrescriptionExectuionListComponent', () => {
  let component: PrescriptionExecutionListComponent;
  let fixture: ComponentFixture<PrescriptionExecutionListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionExecutionListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionExecutionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
