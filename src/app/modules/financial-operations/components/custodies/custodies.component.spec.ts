import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustodiesComponent } from './custodies.component';

describe('CustodiesComponent', () => {
  let component: CustodiesComponent;
  let fixture: ComponentFixture<CustodiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CustodiesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CustodiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
