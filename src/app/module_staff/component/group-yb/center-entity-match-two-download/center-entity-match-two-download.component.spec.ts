import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterEntityMatchTwoDownloadComponent } from './center-entity-match-two-download.component';

describe('CenterEntityMatchTwoDownloadComponent', () => {
  let component: CenterEntityMatchTwoDownloadComponent;
  let fixture: ComponentFixture<CenterEntityMatchTwoDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterEntityMatchTwoDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterEntityMatchTwoDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
