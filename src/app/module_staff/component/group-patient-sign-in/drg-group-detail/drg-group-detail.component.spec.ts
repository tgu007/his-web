import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrgGroupDetailComponent } from './drg-group-detail.component';

describe('DrgGroupDetailComponent', () => {
  let component: DrgGroupDetailComponent;
  let fixture: ComponentFixture<DrgGroupDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrgGroupDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrgGroupDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
