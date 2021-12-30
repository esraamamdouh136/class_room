import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractBillsComponent } from './contract-bills.component';

describe('ContractBillsComponent', () => {
  let component: ContractBillsComponent;
  let fixture: ComponentFixture<ContractBillsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractBillsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractBillsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
