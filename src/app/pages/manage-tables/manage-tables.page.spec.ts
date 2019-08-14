import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageTablesPage } from './manage-tables.page';

describe('ManageTablesPage', () => {
  let component: ManageTablesPage;
  let fixture: ComponentFixture<ManageTablesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageTablesPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageTablesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
