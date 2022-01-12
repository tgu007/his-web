import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeDownloadComponent } from './fee-download.component';

describe('FeeDownloadComponent', () => {
  let component: FeeDownloadComponent;
  let fixture: ComponentFixture<FeeDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
