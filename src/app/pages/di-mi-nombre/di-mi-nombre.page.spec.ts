import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiMiNombrePage } from './di-mi-nombre.page';

describe('DiMiNombrePage', () => {
  let component: DiMiNombrePage;
  let fixture: ComponentFixture<DiMiNombrePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiMiNombrePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiMiNombrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
