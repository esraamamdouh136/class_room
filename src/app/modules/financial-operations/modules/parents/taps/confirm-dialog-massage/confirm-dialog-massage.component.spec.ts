import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDialogMassageComponent } from './confirm-dialog-massage.component';

describe('ConfirmDialogMassageComponent', () => {
  let component: ConfirmDialogMassageComponent;
  let fixture: ComponentFixture<ConfirmDialogMassageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmDialogMassageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmDialogMassageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
