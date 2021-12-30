import { Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import {
  FormArray,
  FormBuilder,
  FormGroup,
  NgForm,
  Validators,
} from "@angular/forms";
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import * as moment from "moment";
import { ToastrService } from "ngx-toastr";
import { combineLatest, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { MY_FORMATS } from "src/app/modules/datePicker";
import { categoriesFeesService } from "src/app/modules/financial-setting/services/cateogries-of-fees/categories-of-fees.service";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { readBuilderProgram } from "typescript";
import { TypesOfFees } from "../../../models/types-of-fees/types-of-fees";
import { classrooms } from "../../../models/classRooms/classrooms";
import { Semesters } from "../../../models/semester/semesters";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: "app-cateogries-add-form",
  templateUrl: "./cateogries-add-form.component.html",
  styleUrls: ["./cateogries-add-form.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    // {provide: MAT_DATE_LOCALE, useValue: 'ar'},
  ],
})
export class CateogriesAddFormComponent implements OnInit {
  @ViewChild("form") checkForm: NgForm;
  subscription: Subscription = new Subscription();

  errorMassage;
  minDate = {};
  maxDate = {};

  classRooms: classrooms;
  feesClasses: TypesOfFees;
  form: FormGroup;
  semsters;
  data_taxes;
  class_rooms;
  calcArrTaxes;

  distributable_value = 0;
  selectedMotherCompanyNumber: number;
  selectedConstCenterNumber: number;
  cat_id: number;
  calcFeesValue: number;
  Fixed_distributable_value: number;
  selectedFiscalYearId: number;

  note: boolean;
  noSemesterFound = this.translation.instant("common.noSemesterFound");
  constructor(
    private cateogriesServices: categoriesFeesService,
    public lang: TranslationService,
    private list: ListsService,
    private fb: FormBuilder,
    private toaster: ToastrService,
    private _shredService: SharedService,
    private translation: TranslateService,
    private router: Router,
    private activatedroute: ActivatedRoute,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.activatedroute.queryParams.subscribe((params) => {
      this.cat_id = params["id"];
    });
    this.subscription.add(
      this.sharedService.navChanged$.subscribe((data) => {
        if (data) {
          this.selectedMotherCompanyNumber = data.companyNum;
          this.selectedConstCenterNumber = data.costCenter;
          this.selectedFiscalYearId = data.fiscalYear;
          this.getClassRooms();
          this.getSemsters();
          this.getTaxes();
          this.getFeesClasses();
          if (this.cat_id) {
            this.patchCategoriesData();
          }
        }
      })
    );
    this.initForm();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initForm() {
    this.form = this.fb.group({
      name_ar: ["", Validators.required],
      name_en: ["", Validators.required],
      class_rooms: ["", Validators.required],
      fees_class_id: ["", Validators.required],
      fees_value: ["", Validators.required],
      taxes_included: [false, Validators.required],
      status: [1],
      taxes: this.fb.array([]),
    });
  }

  getClassRooms() {
    this.list
      .getClassRoomsList(
        this.selectedMotherCompanyNumber,
        this.selectedConstCenterNumber
      )
      .subscribe((res: any) => {
        this.classRooms = res.items;
      });
  }

  getTaxes() {
    this.list
      .getTaxes(
        this.selectedMotherCompanyNumber,
        this.selectedConstCenterNumber
      )
      .subscribe((res: any) => {
        this.data_taxes = res.items.map((item: any) => {
          return {
            ...item,
            taxes_name: "%" + item.percentage + item.name,
          };
        });
      });
  }

  getSemsters() {
    this.list
      .getSemster(
        this.selectedMotherCompanyNumber,
        this.selectedConstCenterNumber,
        this.selectedFiscalYearId
      )
      .subscribe((res: any) => {
        this.initForm();
        if (!this.cat_id) {
          this.addTaxes();
        }
        this.semsters = res.items;
        res.items.map((item) => {
          this.form.addControl(`term_${item.id}`, this.fb.array([]));
          if (!this.cat_id) {
            this.addNewTerm(item.id);
          }
          this.minDate[item.id] = new Date(item.start_at);
          this.maxDate[item.id] = new Date(item.end_at);
        });
      });
  }

  getFeesClasses() {
    this.list
      .getFeesClasses(
        this.selectedMotherCompanyNumber,
        this.selectedConstCenterNumber
      )
      .subscribe((res) => {
        this.feesClasses = res.items;
      });
  }

  term(id?): FormArray {
    return this.form.get(`term_${id}`) as FormArray;
  }

  removeTerm(id, i): void {
    this.term(id).removeAt(i);
  }

  addNewTerm(id, term?) {
    this.term(id).push(this.newTerm(term));
  }

  newTerm(term?): FormGroup {
    return this.fb.group({
      date: term ? term.date : "",
      name: term ? term.name : "",
      amount: term ? term.amount : "",
    });
  }

  newTaxes(tax?): FormGroup {
    return this.fb.group({
      taxes_per: tax ? tax : "",
    });
  }
  addTaxes(tax?): void {
    this.taxes().push(this.newTaxes(tax));
  }
  removeTaxes(i): void {
    this.taxes().removeAt(i);
  }
  taxes() {
    return this.form.get("taxes") as FormArray;
  }

  onSubmit() {
    this.cateogriesServices
      .categories_body(this.prepareBodyBeforeSubmit(this.form))
      .subscribe(
        (res: any) => {
          this.toaster.success(res.message);
          setTimeout(() => {
            this.router.navigateByUrl(
              "/settings/general-ledger/cateogries-of-fees"
            );
          });
        },
        (err) => {
          this.toaster.error(err.error?.fees_type_premium);
          this.errorMassage = {};
          this.errorMassage = err?.error;
        }
      );
  }

  prepareBodyBeforeSubmit(form) {
    let fees_type_premium = [];
    this.semsters?.map((item) => {
      form.get("term_" + item.id)?.value.map((el) => {
        fees_type_premium.push({
          name_ar: el.name,
          name_en: el.name,
          semster_id: item.id,
          due_date: moment(el.date).format("DD/MM/YYYY"),
          premium_value: +el.amount,
        });
      });
    });
    return {
      name_ar: this.form.get("name_ar")?.value,
      name_en: this.form.get("name_en")?.value,
      status: this.form.get("status")?.value ? 1 : 2,
      taxes_included: this.form.get("taxes_included")?.value,
      fees_value: +this.form.get("fees_value")?.value,
      fees_type_premium,
      classrooms: this.form
        .get("class_rooms")
        ?.value.map((item) => (item?.id ? item?.id : item)),
      taxes: this.form
        .get("taxes")
        ?.value.map((tax) =>
          tax?.taxes_per?.id ? tax?.taxes_per?.id : tax.taxes_per
        ),
      id: this.cat_id ? this.cat_id : null,
      fees_class_id: this.form.get("fees_class_id")?.value,
    };
  }

  patchCategoriesData() {
    if (this.cat_id) {
      this.cateogriesServices
        .getDataById(this.cat_id)
        .pipe(
          map((res: any) => {
            return res.item;
          })
        )
        .subscribe((res: any) => {
          if (this.selectedConstCenterNumber != res?.cost_center_id) {
            this.router.navigate([
              "/settings/general-ledger/cateogries-of-fees",
            ]);
          }
          setTimeout(() => {
            this.class_rooms = [];
            this.form.patchValue({
              name_ar: res.name_ar,
              name_en: res.name_en,
              status: res.status == 1 ? true : false,
              taxes_included: res.taxes_included,
              classrooms: res.classrooms.map((res: any) => {
                this.class_rooms.push({ id: res.id, name: res.name });
                return res.id;
              }),
              fees_class_id: res.fees_class_id,
              fees_value: res.fees_value,
            });

            res.taxes.map((res: any) => {
              this.addTaxes(res);
            });
            res.fees_type_premiums.map((res: any) => {
              this.addNewTerm(res.semster_id, {
                date: res.due_date,
                name: res.name,
                amount: res.premium_value,
              });
            });
            this.onChangeValues();
          });
        });
    }
  }

  onChangeValues() {
    if (this.form.get("taxes_included")?.value == "") {
      this.distributable_value = this.form?.get("fees_value").value;
      this.Fixed_distributable_value = this.form?.get("fees_value").value;
      this.subtractionAmount();
    } else {
      let body = {
        taxes_included:
          this.form.get("taxes_included")?.value == "" ? false : true,
        fees_value: this.form.get("fees_value")?.value,
        taxes: this.form
          .get("taxes")
          ?.value.map((tax) =>
            tax?.taxes_per?.id ? tax?.taxes_per?.id : tax.taxes_per
          ),
      };
      this.cateogriesServices.getCalc(body).subscribe((res: any) => {
        this.calcArrTaxes = res.items?.taxes;
        this.distributable_value = res.items?.distributable_value;
        this.Fixed_distributable_value = res.items?.fees_value;
        this.subtractionAmount();
      });
    }
    this.note = true;
  }

  subtractionAmount() {
    this.semsters.map((item) => {
      this.form.get("term_" + item.id)?.value.map((el) => {
        this.distributable_value = (
          this.distributable_value - el.amount
        )
      });
    });
  }

  showNote() {
    this.note = true;
  }
  hiddenNote() {
    this.note = false;
  }
}
