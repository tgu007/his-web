import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LabBottleCardPrintComponent } from './lab-bottle-card-print.component';

describe('LabBottleCardPrintComponent', () => {
  let component: LabBottleCardPrintComponent;
  let fixture: ComponentFixture<LabBottleCardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LabBottleCardPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LabBottleCardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
