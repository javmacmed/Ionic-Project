import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnePalabrasPage } from './une-palabras.page';

describe('UnePalabrasPage', () => {
  let component: UnePalabrasPage;
  let fixture: ComponentFixture<UnePalabrasPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UnePalabrasPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UnePalabrasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
