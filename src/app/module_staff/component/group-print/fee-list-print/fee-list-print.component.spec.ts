import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FeeListPrintComponent} from './fee-list-print.component';

describe('FeeListPrintComponent', () => {
  let component: FeeListPrintComponent;
  let fixture: ComponentFixture<FeeListPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FeeListPrintComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeListPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
