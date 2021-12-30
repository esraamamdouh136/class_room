import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentsInformationComponent } from './update-students-information.component';

describe('UpdateStudentsInformationComponent', () => {
  let component: UpdateStudentsInformationComponent;
  let fixture: ComponentFixture<UpdateStudentsInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UpdateStudentsInformationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateStudentsInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
