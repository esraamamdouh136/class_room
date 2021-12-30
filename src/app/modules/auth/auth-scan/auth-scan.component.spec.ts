import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthScanComponent } from './auth-scan.component';

describe('AuthScanComponent', () => {
  let component: AuthScanComponent;
  let fixture: ComponentFixture<AuthScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthScanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
