import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolWeeksComponent } from './school-weeks.component';

describe('SchoolWeeksComponent', () => {
  let component: SchoolWeeksComponent;
  let fixture: ComponentFixture<SchoolWeeksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchoolWeeksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchoolWeeksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
