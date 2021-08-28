import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingCardPrintComponent } from './nursing-card-print.component';

describe('NursingCardPrintComponent', () => {
  let component: NursingCardPrintComponent;
  let fixture: ComponentFixture<NursingCardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursingCardPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingCardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
