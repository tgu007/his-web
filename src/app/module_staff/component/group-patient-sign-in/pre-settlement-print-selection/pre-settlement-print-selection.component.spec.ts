import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSettlementPrintSelectionComponent } from './pre-settlement-print-selection.component';

describe('PreSettlementPrintSelectionComponent', () => {
  let component: PreSettlementPrintSelectionComponent;
  let fixture: ComponentFixture<PreSettlementPrintSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreSettlementPrintSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreSettlementPrintSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
