import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CommonDynamicSelectComponent} from './common-dynamic-select.component';

describe('CommonDynamicSelectComponent', () => {
  let component: CommonDynamicSelectComponent;
  let fixture: ComponentFixture<CommonDynamicSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CommonDynamicSelectComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommonDynamicSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
