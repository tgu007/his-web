import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalAutoFeeDetailComponent } from './internal-auto-fee-detail.component';

describe('InternalAutoFeeDetailComponent', () => {
  let component: InternalAutoFeeDetailComponent;
  let fixture: ComponentFixture<InternalAutoFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalAutoFeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalAutoFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
