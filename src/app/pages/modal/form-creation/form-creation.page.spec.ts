import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreationPage } from './form-creation.page';

describe('FormCreationPage', () => {
  let component: FormCreationPage;
  let fixture: ComponentFixture<FormCreationPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCreationPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
