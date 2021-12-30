import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {TranslationService} from 'src/app/modules/i18n/translation.service';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {StudentList} from '../../models/student';
import { ListsService } from 'src/app/shared/services/list_Service/lists.service';
import { SharedService } from 'src/app/shared/services/shared.service';
import { Subscription } from 'rxjs';
import { StudentsService } from "../../services/students/students.service";

@Component({
  selector: 'app-add-editform',
  templateUrl: './add-editform.component.html',
  styleUrls: ['./add-editform.component.scss']
})
export class AddEditformComponent implements OnInit {
  subscription: Subscription = new Subscription();
  selectedMotherCompanyNumber;
  selectedConstCenterNumber;
  form: FormGroup;
  fileToUpload: any;
  countries : any;
  class_room : any;
  imageUrl: any;
  mode: 'save' | 'update' = 'save';
  formErrors = {};
  editedData: StudentList;
  gender = [
    {
      name: this.translateService.instant('general.male'),
      id: 'male'
    },
    {
      name: this.translateService.instant('general.female'),
      id: 'female'
    }
  ];

  constructor(
    private translateService: TranslateService,
    public translation: TranslationService,
    private formBuilder: FormBuilder,
    private router: Router,
    private listsService: ListsService,
    private sharedService: SharedService,
    private activatedRoute: ActivatedRoute,
    private toaster: ToastrService,
    private studentsService: StudentsService,
  ) {
    this.activatedRoute.queryParams.subscribe(res => res?.edit ? this.mode = 'update' : this.mode = 'save');
    this.editedData = this.router.getCurrentNavigation()?.extras?.state;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.sharedService.navChanged$.subscribe((data) => {
        if (data) {
          this.selectedMotherCompanyNumber = data.companyNum;
          this.selectedConstCenterNumber = data.costCenter;
          this.endPoints()
        }
      }))
    this.form = this.formBuilder.group({
      username: [''],
      password: [''],
      identity_number: [''],
      first_name: [''],
      first_name_en: [''],
      family_name_ar: [''],
      family_name_en: [''],
      father_name: [''],
      father_name_en: [''],
      last_name_en: [''],
      grand_father_name: [''],
      email: [''],
      last_name: [''],
      fingerprint: [''],
      passport_number: [''],
      nationality: [null],
      academic_id: [''],
      gender: [null],
      birthdate: [''],
      birth_place: [''],
      acceptance_year: [''],
      classRoom: [''],
      semester: [null],
      former_teacher: [''],
      joining_date: [''],
      fatherIDnumber: [''],
      motherIDnumber: [''],
      motherFullName: [''],
      mobile_number: [''],
      address_ar: [''],
      address_en: [''],
      phone_number: [''],
      grade: [''],
      address: [''],
      old_school: [''],
      grandfather_name: [''],
      class_id: [null],
      family_name: ['']
    });
    if (this.mode === 'update' && this.editedData?.id) {
      this.fillForm();
    }

    this.listsService.countries().subscribe((res:any)=>{
      this.countries = res.items
    })

  }

  endPoints(){
    this.listsService.getClassRoomsList(this.selectedMotherCompanyNumber,this.selectedConstCenterNumber).subscribe((res: any) => {
     this.class_room =  res.items

    })
  }

  fillForm(): void {
    this.form.patchValue({
      ...this.editedData,
    });
  }

  Submit() {
    let data = this.form.getRawValue();
    if (this.mode === 'update') {
      const obj = this.form.getRawValue();
      data = Object.keys(obj)
        .filter((k) => obj[k] != null && obj[k] !== '')
        .reduce((a, k) => ({...a, [k]: obj[k]}), {});
    }
    this.studentsService.addEditStudent(data)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.code === 200) {
            this.router.navigate(['/financial-operations/students']);
          } else if (res?.code === 422) {
            this.formErrors = res?.errors;
            this.errorToaster(res.errors);
          }
          // this.location.back();
        }
      );
  }

  errorToaster(err): void {
    for (const error in err) {
      this.toaster.error(`${err[error]} ${error}`);
    }
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    // Show image preview
    const reader = new FileReader();
    reader.onload = (event: any) => {
      this.imageUrl = event.target.result;
    };
    reader.readAsDataURL(this.fileToUpload);
    const formData = new FormData();
    formData.append('home_image', this.fileToUpload);
  }
}


