import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgSetPresentBtnComponent } from './ag-set-present-btn.component';

describe('AgSetPresentBtnComponent', () => {
  let component: AgSetPresentBtnComponent;
  let fixture: ComponentFixture<AgSetPresentBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgSetPresentBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgSetPresentBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
