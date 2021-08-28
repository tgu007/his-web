import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MedicineMatchComponent} from './medicine-match.component';

describe('MedicineMatchComponent', () => {
  let component: MedicineMatchComponent;
  let fixture: ComponentFixture<MedicineMatchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MedicineMatchComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineMatchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
