import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeableItemDetailComponent } from './chargeable-item-detail.component';

describe('ChargeableItemDetailComponent', () => {
  let component: ChargeableItemDetailComponent;
  let fixture: ComponentFixture<ChargeableItemDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeableItemDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeableItemDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
