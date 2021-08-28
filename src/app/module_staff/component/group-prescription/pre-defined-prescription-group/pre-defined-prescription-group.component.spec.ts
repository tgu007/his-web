import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreDefinedPrescriptionGroupComponent } from './pre-defined-prescription-group.component';

describe('PreDefinedPrescriptionGroupComponent', () => {
  let component: PreDefinedPrescriptionGroupComponent;
  let fixture: ComponentFixture<PreDefinedPrescriptionGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreDefinedPrescriptionGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreDefinedPrescriptionGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
