import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreSettlementPrintComponent } from './pre-settlement-print.component';

describe('PreSettlementPrintComponent', () => {
  let component: PreSettlementPrintComponent;
  let fixture: ComponentFixture<PreSettlementPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreSettlementPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreSettlementPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
