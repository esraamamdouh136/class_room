import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormDeclarationComponent } from './form-declaration.component';

describe('FormDeclarationComponent', () => {
  let component: FormDeclarationComponent;
  let fixture: ComponentFixture<FormDeclarationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FormDeclarationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormDeclarationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
