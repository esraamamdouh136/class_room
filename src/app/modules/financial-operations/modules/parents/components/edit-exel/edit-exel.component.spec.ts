import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditExelComponent } from './edit-exel.component';

describe('EditExelComponent', () => {
  let component: EditExelComponent;
  let fixture: ComponentFixture<EditExelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditExelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditExelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
