import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VeinDropBottleCardComponent } from './vein-drop-bottle-card.component';

describe('VeinDorpBottleCardComponent', () => {
  let component: VeinDropBottleCardComponent;
  let fixture: ComponentFixture<VeinDropBottleCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VeinDropBottleCardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeinDropBottleCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
