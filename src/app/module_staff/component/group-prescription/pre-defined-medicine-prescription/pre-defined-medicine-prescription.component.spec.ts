import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreDefinedMedicinePrescriptionComponent } from './pre-defined-medicine-prescription.component';

describe('PreDefinedMedicinePrescriptionComponent', () => {
  let component: PreDefinedMedicinePrescriptionComponent;
  let fixture: ComponentFixture<PreDefinedMedicinePrescriptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreDefinedMedicinePrescriptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreDefinedMedicinePrescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
