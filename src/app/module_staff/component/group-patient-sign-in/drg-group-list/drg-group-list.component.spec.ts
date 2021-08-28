import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrgGroupListComponent } from './drg-group-list.component';

describe('DrgGroupListComponent', () => {
  let component: DrgGroupListComponent;
  let fixture: ComponentFixture<DrgGroupListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrgGroupListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrgGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
