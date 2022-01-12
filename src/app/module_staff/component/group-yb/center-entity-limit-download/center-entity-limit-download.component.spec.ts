import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterEntityLimitDownloadComponent } from './center-entity-limit-download.component';

describe('CenterEntityLimitDownloadComponent', () => {
  let component: CenterEntityLimitDownloadComponent;
  let fixture: ComponentFixture<CenterEntityLimitDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterEntityLimitDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterEntityLimitDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
