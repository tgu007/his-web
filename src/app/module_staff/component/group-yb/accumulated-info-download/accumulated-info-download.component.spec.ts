import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccumulatedInfoDownloadComponent } from './accumulated-info-download.component';

describe('AccumulatedInfoDownloadComponent', () => {
  let component: AccumulatedInfoDownloadComponent;
  let fixture: ComponentFixture<AccumulatedInfoDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccumulatedInfoDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccumulatedInfoDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
