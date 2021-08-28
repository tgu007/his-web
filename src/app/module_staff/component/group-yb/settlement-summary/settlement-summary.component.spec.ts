import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementSummaryComponent } from './settlement-summary.component';

describe('SettlementSummaryComponent', () => {
  let component: SettlementSummaryComponent;
  let fixture: ComponentFixture<SettlementSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
