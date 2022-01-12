import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DepartmentDownloadComponent } from './department-download.component';

describe('DepartmentDownloadComponent', () => {
  let component: DepartmentDownloadComponent;
  let fixture: ComponentFixture<DepartmentDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DepartmentDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DepartmentDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
