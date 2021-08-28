import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NursingTreatmentCardPrintComponent } from './nursing-treatment-card-print.component';

describe('NursingTreatmentCardPrintComponent', () => {
  let component: NursingTreatmentCardPrintComponent;
  let fixture: ComponentFixture<NursingTreatmentCardPrintComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NursingTreatmentCardPrintComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NursingTreatmentCardPrintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
