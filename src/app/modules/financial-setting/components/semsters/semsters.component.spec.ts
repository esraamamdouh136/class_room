import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SemstersComponent } from './semsters.component';

describe('SemstersComponent', () => {
  let component: SemstersComponent;
  let fixture: ComponentFixture<SemstersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SemstersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SemstersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
