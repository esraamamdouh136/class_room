import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReceiptVouchersComponent } from './receipt-vouchers.component';

describe('ReceiptVouchersComponent', () => {
  let component: ReceiptVouchersComponent;
  let fixture: ComponentFixture<ReceiptVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReceiptVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReceiptVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
