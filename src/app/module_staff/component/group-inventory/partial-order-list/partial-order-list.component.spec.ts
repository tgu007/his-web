import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PartialOrderListComponent} from './partial-order-list.component';

describe('PartialOrderListComponent', () => {
  let component: PartialOrderListComponent;
  let fixture: ComponentFixture<PartialOrderListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartialOrderListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
