import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgIsDefaultBtnComponent } from './ag-is-default-btn.component';

describe('AgIsDefaultBtnComponent', () => {
  let component: AgIsDefaultBtnComponent;
  let fixture: ComponentFixture<AgIsDefaultBtnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgIsDefaultBtnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgIsDefaultBtnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
