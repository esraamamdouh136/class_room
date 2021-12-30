import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ParentsListAgGridComponent } from './parents-list-ag-grid.component';

describe('ParentsListAgGridComponent', () => {
  let component: ParentsListAgGridComponent;
  let fixture: ComponentFixture<ParentsListAgGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ParentsListAgGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ParentsListAgGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
