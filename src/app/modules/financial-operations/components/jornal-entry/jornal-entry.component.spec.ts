import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JornalEntryComponent } from './jornal-entry.component';

describe('JornalEntryComponent', () => {
  let component: JornalEntryComponent;
  let fixture: ComponentFixture<JornalEntryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JornalEntryComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(JornalEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
