import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PartialOrderDetailComponent} from './partial-order-detail.component';

describe('PartialOrderDetailComponent', () => {
  let component: PartialOrderDetailComponent;
  let fixture: ComponentFixture<PartialOrderDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartialOrderDetailComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartialOrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
