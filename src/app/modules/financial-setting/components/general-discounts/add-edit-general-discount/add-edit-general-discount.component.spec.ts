import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDiscountsFormComponent } from './add-edit-general-discount.component';

describe('GeneralDiscountsFormComponent', () => {
  let component: GeneralDiscountsFormComponent;
  let fixture: ComponentFixture<GeneralDiscountsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GeneralDiscountsFormComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDiscountsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
