import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudeyYearsComponent } from './studey-years.component';

describe('StudeyYearsComponent', () => {
  let component: StudeyYearsComponent;
  let fixture: ComponentFixture<StudeyYearsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StudeyYearsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StudeyYearsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
