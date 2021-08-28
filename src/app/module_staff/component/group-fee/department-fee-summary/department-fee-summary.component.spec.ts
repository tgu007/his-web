import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentFeeSummaryComponent } from './department-fee-summary.component';

describe('DepartmentFeeSummaryComponent', () => {
  let component: DepartmentFeeSummaryComponent;
  let fixture: ComponentFixture<DepartmentFeeSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentFeeSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentFeeSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
