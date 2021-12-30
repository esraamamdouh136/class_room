import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpireTokenModelComponent } from './expire-token-model.component';

describe('ExpireTokenModelComponent', () => {
  let component: ExpireTokenModelComponent;
  let fixture: ComponentFixture<ExpireTokenModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpireTokenModelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpireTokenModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
