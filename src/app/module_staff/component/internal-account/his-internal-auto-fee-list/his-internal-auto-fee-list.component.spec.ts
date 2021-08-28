import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HisInternalAutoFeeListComponent } from './his-internal-auto-fee-list.component';

describe('HisInternalAutoFeeListComponent', () => {
  let component: HisInternalAutoFeeListComponent;
  let fixture: ComponentFixture<HisInternalAutoFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HisInternalAutoFeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HisInternalAutoFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
