import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPreparationTableComponent } from './student-preparation-table.component';

describe('StudentPreparationTableComponent', () => {
  let component: StudentPreparationTableComponent;
  let fixture: ComponentFixture<StudentPreparationTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudentPreparationTableComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudentPreparationTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
