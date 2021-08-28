import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChargeableItemListComponent } from './chargeable-item-list.component';

describe('ChargeableItemListComponent', () => {
  let component: ChargeableItemListComponent;
  let fixture: ComponentFixture<ChargeableItemListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChargeableItemListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChargeableItemListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
