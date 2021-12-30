import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CateogriesAddFormComponent } from './cateogries-add-form.component';


describe('CateogriesAddFormComponent', () => {
  let component: CateogriesAddFormComponent;
  let fixture: ComponentFixture<CateogriesAddFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CateogriesAddFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CateogriesAddFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
