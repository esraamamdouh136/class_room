import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import * as moment from "moment";
import { Observable, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged, map, startWith, switchMap } from "rxjs/operators";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { ContractsService } from "../../../../service/contracts/contracts.service";

@Component({
  selector: 'app-add-edit-contract',
  templateUrl: './add-edit-contract.component.html',
  styleUrls: ['./add-edit-contract.component.scss']
})
export class AddEditContractComponent implements OnInit {
  students = [];
  company = [];
  contracts = [];
  listClassRooms = [];
  generalDiscount = [];
  specialDiscount = [];
  companyNumber;
  selectedCostCenter;
  form: FormGroup;
  scools;
  formErrors
  formControlsErrors: any;
  filteredOptions: Observable<any[]>;
  subscription: Subscription = new Subscription();
  constructor(
    private formBuilder: FormBuilder,
    private _contract: ContractsService,
    private shared: SharedService,
    private listsService: ListsService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialogRef<AddEditContractComponent>,
  ) { }

  ngOnInit(): void {
    this.shared.navChanged$.subscribe(data => {
      if (data) {
        this.companyNumber = data.companyNum;
        this.selectedCostCenter = data.costCenter;
        // Fack
        this.company.push(data.selectedCompany)
        
        this.getData();
      }
    })
    this.form = this.formBuilder.group({
      date: ['', Validators.required],
      student_id: ['', Validators.required],
      company: [{ value: '', disabled: true }, Validators.required],
      contract_template_id: [null, Validators.required],
      classroom_id: ['', Validators.required],
      general_discounts: ['', Validators.required],
      special_discounts: ['', Validators.required],
    });
    this.form.get('company').setValue(this.company[0]?.id)
    this.fillData();
    // this.filterAutoCompleteOptions();

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  getData() {
    this.subscription.add(
      // this._studyYears.getSeasons(body).subscribe(res => {
      //   this.seasons = res?.data[0];
      // })
    )

    this.getStudentsList('');

    this.subscription.add(
      this._contract.getContractsList().subscribe(res => {
        this.contracts = res?.paginate.data;
      })
    )

    this.subscription.add(
      this.listsService.getClassRoomsList(this.companyNumber, this.selectedCostCenter).subscribe((res: any) => {
        this.listClassRooms = res?.items;
        if(this.form.get('classroom_id').value){
            this.SelectClass({id:this.form.get('classroom_id').value})
        }
      }
    ))
  }

  getStudentsList(word){
    this.subscription.add(
      this._contract.getStudentsList(this.companyNumber, word)
        .subscribe(res => {
          this.students = res?.items;
          if(this.data?.data?.student_id){
            const student = {
              full_name : this.data?.data?.student_name,
              id : this.data?.data?.student_id,
            }
            this.students.push(student);
            this.form.get('student_id').setValue(student?.id);
          }
        })
    )
  }

  searchOnStudents(word){
    if(word){
      this.getStudentsList(word);
    }
  }

  SelectClass(e){
    this.subscription.add(
      this.listsService.getGeneralDiscount(this.companyNumber, this.selectedCostCenter,e?.id).subscribe((res: any) => {
        this.generalDiscount = res?.items;
      }
    ))

    this.subscription.add(
      this.listsService.getSpecialDiscount(this.companyNumber, this.selectedCostCenter,e?.id).subscribe((res: any) => {
        this.specialDiscount = res?.items;
      }
    ))
  }


  fillData() {
    if (this.data.data) {
      const data = {
        date: moment(this.data.data.date_show, 'DD/MM/YYYY').toDate(),
        student_id: this.data.data.student_id,
        company: this.company[0]?.id,
        contract_template_id: this.data.data.contract_template_id,
        classroom_id: this.data.data.classroom_id,
        special_discounts: this.data.data.special_discounts.map(e => e.id),
        general_discounts: this.data.data.general_discounts.map(e => e.id),
      }
      this.form.patchValue(data);
    }

    if(this.data?.disable){
      this.form.disable();
    }
  }

  // displayFn(node): string {
  //   return node && node.full_name ? node.full_name : '';
  // }

  // Auto complete
  // filterAutoCompleteOptions() {
  //   this.subscription.add(
  //     this.form.get('student_id').valueChanges.pipe(
  //       startWith(''),
  //       debounceTime(400),
  //       distinctUntilChanged(),
  //       map(value => typeof value === 'string' ? value : value.name),
  //       switchMap(val => {
  //         return this._contract.getStudentsList(this.companyNumber, val)
  //       })
  //     ).subscribe(res => {
  //       this.students = res?.items;
  //     })
  //   )
  // }

  onsubmit() {
    const body = this.prepareDataBeforePost();
    this.addContract(body);

  }

  addContract(body) {
    this.subscription.add(
      this._contract.addContract(body).subscribe((res: any) => {

        this.formControlsErrors = {};
        this.dialog.close(true);
        this.form.reset();
      }, error => {
        this.formErrors = error?.error;
      })
    )

  }

  updateContract(body) {
    this.subscription.add(
      this._contract.updateContract(body).subscribe((res: any) => {
        this.formControlsErrors = {};
        this.dialog.close(true);
        this.form.reset();
      }, error => {

      })
    )
  }

  // To map Body
  prepareDataBeforePost() {
    const data = {
      ...this.form.value,
      id: this.data?.data?.id ? this.data?.data?.id : 0,
      student_id: this.form.value.student_id,
      date: this.form.value.date ? moment(this.form.value.date).format('DD/MM/YYYY') : null
    };

    delete data.company
    return data
  }

}
