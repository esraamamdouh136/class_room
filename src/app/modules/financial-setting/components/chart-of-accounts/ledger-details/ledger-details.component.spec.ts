import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LedgerDetailsComponent } from './ledger-details.component';

describe('LedgerDetailsComponent', () => {
  let component: LedgerDetailsComponent;
  let fixture: ComponentFixture<LedgerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LedgerDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LedgerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
