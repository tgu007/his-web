import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MyFeeComponent} from './my-fee.component';

describe('PatientComponent', () => {
  let component: MyFeeComponent;
  let fixture: ComponentFixture<MyFeeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MyFeeComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyFeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
