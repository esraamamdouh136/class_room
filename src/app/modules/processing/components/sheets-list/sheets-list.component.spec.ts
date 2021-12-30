import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SheetsListComponent } from './sheets-list.component';

describe('SheetsListComponent', () => {
  let component: SheetsListComponent;
  let fixture: ComponentFixture<SheetsListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SheetsListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SheetsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
