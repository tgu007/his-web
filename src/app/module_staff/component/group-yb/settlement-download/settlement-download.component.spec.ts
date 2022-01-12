import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SettlementDownloadComponent } from './settlement-download.component';

describe('SettlementDownloadComponent', () => {
  let component: SettlementDownloadComponent;
  let fixture: ComponentFixture<SettlementDownloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SettlementDownloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SettlementDownloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
