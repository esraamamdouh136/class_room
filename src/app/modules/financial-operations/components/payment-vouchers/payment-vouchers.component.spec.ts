import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentVouchersComponent } from './payment-vouchers.component';

describe('PaymentVouchersComponent', () => {
  let component: PaymentVouchersComponent;
  let fixture: ComponentFixture<PaymentVouchersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaymentVouchersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentVouchersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
