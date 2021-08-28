import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { YbImageUploadComponent } from './yb-image-upload.component';

describe('YbImageUploadComponent', () => {
  let component: YbImageUploadComponent;
  let fixture: ComponentFixture<YbImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ YbImageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(YbImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
