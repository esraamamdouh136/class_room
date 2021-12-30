import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditSchoolWeekComponent } from './add-edit-school-week.component';

describe('AddEditSchoolWeekComponent', () => {
  let component: AddEditSchoolWeekComponent;
  let fixture: ComponentFixture<AddEditSchoolWeekComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditSchoolWeekComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditSchoolWeekComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
