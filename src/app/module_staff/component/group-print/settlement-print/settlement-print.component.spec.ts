import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementPrintComponent } from './settlement-print.component';

describe('SettlementPrintComponent', () => {
  let component: SettlementPrintComponent;
  let fixture: ComponentFixture<SettlementPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
