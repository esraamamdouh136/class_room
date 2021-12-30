import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditFilesComponent } from './add-edit-files.component';

describe('AddEditFilesComponent', () => {
  let component: AddEditFilesComponent;
  let fixture: ComponentFixture<AddEditFilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditFilesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditFilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
