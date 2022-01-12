import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementValidationOverallComponent } from './settlement-validation-overall.component';

describe('SettlementValidationOverallComponent', () => {
  let component: SettlementValidationOverallComponent;
  let fixture: ComponentFixture<SettlementValidationOverallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementValidationOverallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementValidationOverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
