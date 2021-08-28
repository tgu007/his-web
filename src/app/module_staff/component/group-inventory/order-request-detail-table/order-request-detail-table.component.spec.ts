import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OrderRequestDetailTableComponent} from './order-request-detail-table.component';

describe('OrderRequestDetailTableComponent', () => {
  let component: OrderRequestDetailTableComponent;
  let fixture: ComponentFixture<OrderRequestDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderRequestDetailTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderRequestDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
