import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SetLessonComponent } from './set-lesson.component';

describe('SetLessonComponent', () => {
  let component: SetLessonComponent;
  let fixture: ComponentFixture<SetLessonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SetLessonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SetLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
