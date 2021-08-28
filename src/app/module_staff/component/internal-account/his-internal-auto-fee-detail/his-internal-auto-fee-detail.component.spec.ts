import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HisInternalAutoFeeDetailComponent } from './his-internal-auto-fee-detail.component';

describe('HisInternalAutoFeeDetailComponent', () => {
  let component: HisInternalAutoFeeDetailComponent;
  let fixture: ComponentFixture<HisInternalAutoFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HisInternalAutoFeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HisInternalAutoFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
