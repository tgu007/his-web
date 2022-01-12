import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInByTimeDownloadComponent } from './sign-in-by-time-download.component';

describe('SignInByTimeDownloadComponent', () => {
  let component: SignInByTimeDownloadComponent;
  let fixture: ComponentFixture<SignInByTimeDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInByTimeDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInByTimeDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
