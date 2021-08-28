import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InternalFeeListComponent } from './internal-fee-list.component';

describe('InternalFeeListComponent', () => {
  let component: InternalFeeListComponent;
  let fixture: ComponentFixture<InternalFeeListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InternalFeeListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InternalFeeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
