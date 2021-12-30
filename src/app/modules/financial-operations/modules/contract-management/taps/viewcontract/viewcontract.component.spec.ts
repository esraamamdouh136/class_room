import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewcontractComponent } from './viewcontract.component';

describe('ViewcontractComponent', () => {
  let component: ViewcontractComponent;
  let fixture: ComponentFixture<ViewcontractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewcontractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewcontractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
