import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterFeeValidationComponent } from './center-fee-validation.component';

describe('CenterFeeValidationComponent', () => {
  let component: CenterFeeValidationComponent;
  let fixture: ComponentFixture<CenterFeeValidationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterFeeValidationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterFeeValidationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
