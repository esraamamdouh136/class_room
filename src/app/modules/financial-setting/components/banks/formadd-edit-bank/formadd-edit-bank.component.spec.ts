import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormaddEditBankComponent } from './formadd-edit-bank.component';

describe('FormaddEditBankComponent', () => {
  let component: FormaddEditBankComponent;
  let fixture: ComponentFixture<FormaddEditBankComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormaddEditBankComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormaddEditBankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
