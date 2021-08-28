import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YbSignInRecordComponent } from './yb-sign-in-record.component';

describe('YbSignInRecordComponent', () => {
  let component: YbSignInRecordComponent;
  let fixture: ComponentFixture<YbSignInRecordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YbSignInRecordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YbSignInRecordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
