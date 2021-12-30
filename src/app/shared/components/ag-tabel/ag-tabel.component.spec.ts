import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgTabelComponent } from './ag-tabel.component';

describe('AgTabelComponent', () => {
  let component: AgTabelComponent;
  let fixture: ComponentFixture<AgTabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgTabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AgTabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
