import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectGamePage } from './select-game.page';

describe('SelectGamePage', () => {
  let component: SelectGamePage;
  let fixture: ComponentFixture<SelectGamePage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectGamePage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectGamePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
