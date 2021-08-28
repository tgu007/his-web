import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChineseMedicineSlipComponent } from './chinese-medicine-slip.component';

describe('ChineseMedicineSlipComponent', () => {
  let component: ChineseMedicineSlipComponent;
  let fixture: ComponentFixture<ChineseMedicineSlipComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChineseMedicineSlipComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChineseMedicineSlipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
