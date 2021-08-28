import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {PrescriptionChangedListComponent} from './prescription-changed-list.component';

describe('PrescriptionChangLogListComponent', () => {
  let component: PrescriptionChangedListComponent;
  let fixture: ComponentFixture<PrescriptionChangedListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PrescriptionChangedListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrescriptionChangedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
