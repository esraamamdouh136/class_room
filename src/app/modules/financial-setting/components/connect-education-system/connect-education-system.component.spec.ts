import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConnectEducationSystemComponent } from './connect-education-system.component';

describe('ConnectEducationSystemComponent', () => {
  let component: ConnectEducationSystemComponent;
  let fixture: ComponentFixture<ConnectEducationSystemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConnectEducationSystemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConnectEducationSystemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
