import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderRequestListComponent} from './order-request-list.component';

describe('OrderRequestListComponent', () => {
  let component: OrderRequestListComponent;
  let fixture: ComponentFixture<OrderRequestListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderRequestListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
