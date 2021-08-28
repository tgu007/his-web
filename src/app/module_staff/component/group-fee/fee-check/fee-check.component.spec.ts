import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FeeCheckComponent } from './fee-check.component';

describe('FeeCheckComponent', () => {
  let component: FeeCheckComponent;
  let fixture: ComponentFixture<FeeCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FeeCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FeeCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
