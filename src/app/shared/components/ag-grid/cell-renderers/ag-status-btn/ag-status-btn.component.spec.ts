import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgStatusBtnComponent } from './ag-status-btn.component';

describe('AgStatusBtnComponent', () => {
  let component: AgStatusBtnComponent;
  let fixture: ComponentFixture<AgStatusBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgStatusBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgStatusBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
