import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FinancialSettingComponent } from './financial-setting.component';

describe('FinancialSettingComponent', () => {
  let component: FinancialSettingComponent;
  let fixture: ComponentFixture<FinancialSettingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FinancialSettingComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FinancialSettingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
