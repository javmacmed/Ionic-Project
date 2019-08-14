import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectTablePage } from './select-table.page';

describe('SelectTablePage', () => {
  let component: SelectTablePage;
  let fixture: ComponentFixture<SelectTablePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectTablePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectTablePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
