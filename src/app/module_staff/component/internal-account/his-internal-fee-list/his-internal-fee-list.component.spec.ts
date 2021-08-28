import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HisInternalFeeListComponent } from './his-internal-fee-list.component';

describe('HisInternalFeeListComponent', () => {
  let component: HisInternalFeeListComponent;
  let fixture: ComponentFixture<HisInternalFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HisInternalFeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HisInternalFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
