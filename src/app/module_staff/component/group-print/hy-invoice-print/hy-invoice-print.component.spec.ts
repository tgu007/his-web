import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HyInvoicePrintComponent } from './hy-invoice-print.component';

describe('HyInvoicePrintComponent', () => {
  let component: HyInvoicePrintComponent;
  let fixture: ComponentFixture<HyInvoicePrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyInvoicePrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyInvoicePrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
