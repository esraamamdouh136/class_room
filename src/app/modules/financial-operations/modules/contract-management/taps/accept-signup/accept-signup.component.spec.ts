import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptSignupComponent } from './accept-signup.component';

describe('AcceptSignupComponent', () => {
  let component: AcceptSignupComponent;
  let fixture: ComponentFixture<AcceptSignupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AcceptSignupComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptSignupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
