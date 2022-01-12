import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterMedicineChineseComponent } from './center-medicine-chinese.component';

describe('CenterMedicineChineseComponent', () => {
  let component: CenterMedicineChineseComponent;
  let fixture: ComponentFixture<CenterMedicineChineseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterMedicineChineseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterMedicineChineseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
