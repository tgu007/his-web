import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SignInHistroyDownloadComponent } from './sign-in-histroy-download.component';

describe('SignInHistroyDownloadComponent', () => {
  let component: SignInHistroyDownloadComponent;
  let fixture: ComponentFixture<SignInHistroyDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SignInHistroyDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SignInHistroyDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
