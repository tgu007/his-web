import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrescriptionSlipMzComponent } from './prescription-slip-mz.component';

describe('PrescriptionSlipMzComponent', () => {
  let component: PrescriptionSlipMzComponent;
  let fixture: ComponentFixture<PrescriptionSlipMzComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrescriptionSlipMzComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionSlipMzComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
