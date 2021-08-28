import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PartialOrderDetailTableComponent} from './partial-order-detail-table.component';

describe('PartialOrderDetailTableComponent', () => {
  let component: PartialOrderDetailTableComponent;
  let fixture: ComponentFixture<PartialOrderDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartialOrderDetailTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialOrderDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
