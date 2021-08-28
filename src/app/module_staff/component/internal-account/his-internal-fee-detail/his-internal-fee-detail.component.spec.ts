import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HisInternalFeeDetailComponent } from './his-internal-fee-detail.component';

describe('HisInternalFeeDetailComponent', () => {
  let component: HisInternalFeeDetailComponent;
  let fixture: ComponentFixture<HisInternalFeeDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HisInternalFeeDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HisInternalFeeDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
