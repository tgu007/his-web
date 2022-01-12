import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiagnoseDownloadComponent } from './diagnose-download.component';

describe('DiagnoseDownloadComponent', () => {
  let component: DiagnoseDownloadComponent;
  let fixture: ComponentFixture<DiagnoseDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiagnoseDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiagnoseDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
