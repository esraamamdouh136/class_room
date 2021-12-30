import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormClassroomsComponent } from './form-classrooms.component';

describe('FormClassroomsComponent', () => {
  let component: FormClassroomsComponent;
  let fixture: ComponentFixture<FormClassroomsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormClassroomsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormClassroomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
