import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransfareStudentToStudyYearComponent } from './transfare-student-to-study-year.component';

describe('TransfareStudentToStudyYearComponent', () => {
  let component: TransfareStudentToStudyYearComponent;
  let fixture: ComponentFixture<TransfareStudentToStudyYearComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransfareStudentToStudyYearComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TransfareStudentToStudyYearComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
