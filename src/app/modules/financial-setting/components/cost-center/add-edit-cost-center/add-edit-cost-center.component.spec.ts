import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditCostCenterComponent } from './add-edit-cost-center.component';

describe('AddEditCostCenterComponent', () => {
  let component: AddEditCostCenterComponent;
  let fixture: ComponentFixture<AddEditCostCenterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditCostCenterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditCostCenterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
