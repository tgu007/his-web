import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UserRegesitComponent} from './user-regesit.component';

describe('UserRegesitComponent', () => {
  let component: UserRegesitComponent;
  let fixture: ComponentFixture<UserRegesitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserRegesitComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserRegesitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
