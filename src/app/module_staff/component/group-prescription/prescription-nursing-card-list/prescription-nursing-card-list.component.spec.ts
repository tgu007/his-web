import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionNursingCardListComponent} from './prescription-nursing-card-list.component';

describe('PrescriptionMedicineCardListComponent', () => {
  let component: PrescriptionNursingCardListComponent;
  let fixture: ComponentFixture<PrescriptionNursingCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionNursingCardListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionNursingCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
