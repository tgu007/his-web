import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StockListPrintComponent } from './stock-list-print.component';

describe('StockListPrintComponent', () => {
  let component: StockListPrintComponent;
  let fixture: ComponentFixture<StockListPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StockListPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StockListPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
