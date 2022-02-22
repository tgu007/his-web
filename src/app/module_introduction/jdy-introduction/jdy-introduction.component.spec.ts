import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JdyIntroductionComponent } from './jdy-introduction.component';

describe('JdyIntroductionComponent', () => {
  let component: JdyIntroductionComponent;
  let fixture: ComponentFixture<JdyIntroductionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JdyIntroductionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JdyIntroductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
