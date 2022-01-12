import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterMedicineWestComponent } from './center-medicine-west.component';

describe('CenterMedicineWestComponent', () => {
  let component: CenterMedicineWestComponent;
  let fixture: ComponentFixture<CenterMedicineWestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterMedicineWestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterMedicineWestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
