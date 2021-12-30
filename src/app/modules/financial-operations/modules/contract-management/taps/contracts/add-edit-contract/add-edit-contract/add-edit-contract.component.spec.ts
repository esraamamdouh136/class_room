import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditContractComponent } from './add-edit-contract.component';

describe('AddEditContractComponent', () => {
  let component: AddEditContractComponent;
  let fixture: ComponentFixture<AddEditContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
