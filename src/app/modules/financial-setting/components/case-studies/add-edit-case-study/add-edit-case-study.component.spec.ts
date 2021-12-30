import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogAddAndEditComponent } from "../../cateogries-of-fees/Components/dialog-add-and-edit/dialog-add-and-edit.component";


describe('DialogAddAndEditComponent', () => {
  let component: DialogAddAndEditComponent;
  let fixture: ComponentFixture<DialogAddAndEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DialogAddAndEditComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddAndEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
