import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionFromParentsComponent } from './collection-from-parents.component';

describe('CollectionFromParentsComponent', () => {
  let component: CollectionFromParentsComponent;
  let fixture: ComponentFixture<CollectionFromParentsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CollectionFromParentsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CollectionFromParentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
