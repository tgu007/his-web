import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalAutoFeeListComponent } from './internal-auto-fee-list.component';

describe('InternalAutoFeeListComponent', () => {
  let component: InternalAutoFeeListComponent;
  let fixture: ComponentFixture<InternalAutoFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalAutoFeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalAutoFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
