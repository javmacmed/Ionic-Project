import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormModPage } from './form-mod.page';

describe('FormModPage', () => {
  let component: FormModPage;
  let fixture: ComponentFixture<FormModPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormModPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormModPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
