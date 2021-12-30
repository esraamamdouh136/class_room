import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContractDownloadDialogComponent } from './contract-download-dialog.component';

describe('ContractDownloadDialogComponent', () => {
  let component: ContractDownloadDialogComponent;
  let fixture: ComponentFixture<ContractDownloadDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContractDownloadDialogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContractDownloadDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
