import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgGridPaginationComponent } from './ag-grid-pagination.component';

describe('AgGridPaginationComponent', () => {
  let component: AgGridPaginationComponent;
  let fixture: ComponentFixture<AgGridPaginationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgGridPaginationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgGridPaginationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
