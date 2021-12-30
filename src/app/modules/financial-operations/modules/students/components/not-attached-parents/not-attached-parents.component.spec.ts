import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotAttachedParentsComponent } from './not-attached-parents.component';

describe('NotAttachedParentsComponent', () => {
  let component: NotAttachedParentsComponent;
  let fixture: ComponentFixture<NotAttachedParentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NotAttachedParentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NotAttachedParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
