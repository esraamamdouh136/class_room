import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadContractComponent } from './download-contract.component';

describe('DownloadContractComponent', () => {
  let component: DownloadContractComponent;
  let fixture: ComponentFixture<DownloadContractComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadContractComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadContractComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
