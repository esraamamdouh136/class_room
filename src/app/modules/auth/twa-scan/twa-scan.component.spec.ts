import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TWAScanComponent } from './twa-scan.component';

describe('TWAScanComponent', () => {
  let component: TWAScanComponent;
  let fixture: ComponentFixture<TWAScanComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TWAScanComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TWAScanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
