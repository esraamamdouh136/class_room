/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { FiscalYearFormComponent } from './add-edit-fiscal-year.component';

describe('FiscalYearFormComponent', () => {
  let component: FiscalYearFormComponent;
  let fixture: ComponentFixture<FiscalYearFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FiscalYearFormComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FiscalYearFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
