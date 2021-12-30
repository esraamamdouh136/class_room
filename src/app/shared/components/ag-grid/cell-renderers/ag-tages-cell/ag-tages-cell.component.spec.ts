import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgTagesCellComponent } from './ag-tages-cell.component';

describe('AgTagesCellComponent', () => {
  let component: AgTagesCellComponent;
  let fixture: ComponentFixture<AgTagesCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgTagesCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgTagesCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
