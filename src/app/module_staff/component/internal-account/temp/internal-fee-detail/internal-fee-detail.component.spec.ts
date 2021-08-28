import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalFeeDetailComponent } from './internal-fee-detail.component';

describe('InternalFeeDetailComponent', () => {
  let component: InternalFeeDetailComponent;
  let fixture: ComponentFixture<InternalFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalFeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
