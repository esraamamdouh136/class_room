import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserDrobdownActionComponent } from './user-drobdown-action.component';

describe('UserDrobdownActionComponent', () => {
  let component: UserDrobdownActionComponent;
  let fixture: ComponentFixture<UserDrobdownActionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserDrobdownActionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserDrobdownActionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
