import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActiveLoadingComponent } from './active-loading.component';

describe('ActiveLoadingComponent', () => {
  let component: ActiveLoadingComponent;
  let fixture: ComponentFixture<ActiveLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActiveLoadingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActiveLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
