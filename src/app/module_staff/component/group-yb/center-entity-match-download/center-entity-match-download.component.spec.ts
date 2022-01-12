import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterEntityMatchDownloadComponent } from './center-entity-match-download.component';

describe('CenterEntityMatchDownloadComponent', () => {
  let component: CenterEntityMatchDownloadComponent;
  let fixture: ComponentFixture<CenterEntityMatchDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterEntityMatchDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterEntityMatchDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
