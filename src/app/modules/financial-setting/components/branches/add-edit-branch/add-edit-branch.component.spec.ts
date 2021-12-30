import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditBranchComponent } from './add-edit-branch.component';

describe('AddEditBranchComponent', () => {
  let component: AddEditBranchComponent;
  let fixture: ComponentFixture<AddEditBranchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditBranchComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditBranchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
