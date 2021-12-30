import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BankReconcilationsComponent } from './bank-reconcilations.component';

describe('BankReconcilationsComponent', () => {
  let component: BankReconcilationsComponent;
  let fixture: ComponentFixture<BankReconcilationsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BankReconcilationsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BankReconcilationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
