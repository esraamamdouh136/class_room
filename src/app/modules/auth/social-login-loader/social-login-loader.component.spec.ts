import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SocialLoginLoaderComponent } from './social-login-loader.component';

describe('SocialLoginLoaderComponent', () => {
  let component: SocialLoginLoaderComponent;
  let fixture: ComponentFixture<SocialLoginLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SocialLoginLoaderComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialLoginLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
