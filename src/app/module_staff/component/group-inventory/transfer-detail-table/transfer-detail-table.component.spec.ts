import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TransferDetailTableComponent} from './transfer-detail-table.component';

describe('ItemTransferDetailTableComponent', () => {
  let component: TransferDetailTableComponent;
  let fixture: ComponentFixture<TransferDetailTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TransferDetailTableComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransferDetailTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
