import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionTextDetailComponent} from './prescription-text-detail.component';

describe('PrescriptionNewTextComponent', () => {
  let component: PrescriptionTextDetailComponent;
  let fixture: ComponentFixture<PrescriptionTextDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionTextDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionTextDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
