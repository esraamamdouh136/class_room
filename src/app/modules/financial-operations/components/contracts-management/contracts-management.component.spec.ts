import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractsManagementComponent } from './contracts-management.component';

describe('ContractsManagementComponent', () => {
  let component: ContractsManagementComponent;
  let fixture: ComponentFixture<ContractsManagementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractsManagementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractsManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
