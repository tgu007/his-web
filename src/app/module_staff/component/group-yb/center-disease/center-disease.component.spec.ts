import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CenterDiseaseComponent } from './center-disease.component';

describe('CenterDiseaseComponent', () => {
  let component: CenterDiseaseComponent;
  let fixture: ComponentFixture<CenterDiseaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CenterDiseaseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CenterDiseaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
