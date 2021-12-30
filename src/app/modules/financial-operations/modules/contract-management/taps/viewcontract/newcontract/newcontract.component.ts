import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
  ViewChild,
} from "@angular/core";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MomentDateAdapter } from "@angular/material-moment-adapter";
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from "@angular/material/core";
import { ToastrService } from "ngx-toastr";

import { forkJoin, Subscription } from "rxjs";
import { MY_FORMATS } from "src/app/modules/datePicker";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { SharedService } from "src/app/shared/services/shared.service";
import { CopyContentService } from "../../../service/copy-content.service";
import { ServiceService } from "../../../service/service.service";
import { EditorComponent } from "@tinymce/tinymce-angular";
import { ActivatedRoute, Router } from "@angular/router";
import { TranslateService } from "@ngx-translate/core";
import { classrooms } from "src/app/modules/financial-setting/models/classRooms/classrooms";
import { TypesOfFees } from "src/app/modules/financial-setting/models/types-of-fees/types-of-fees";
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
  selector: "app-newcontract",
  templateUrl: "./newcontract.component.html",
  styleUrls: ["./newcontract.component.scss"],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    {
      provide: MAT_DATE_FORMATS,
      useValue: MY_FORMATS,
    },
  ],
})
export class NewcontractComponent implements OnInit, OnDestroy {
  form: FormGroup;
  name = 'Angular ';
  editor = ClassicEditor;
  data: any = `<p>Hello, world!</p>`;
  subscription: Subscription = new Subscription();
  @ViewChild("editorComponent") editorComp: EditorComponent;
  @ViewChild("editorForitem") editorForitem: EditorComponent;
  @ViewChild("conclusion_desc") editorForconclusion: EditorComponent;
  @ViewChild("editorComponentContract")
  editorComponentContract: EditorComponent;

  switchEditors = {};
  formErrors: any;
  classRooms: classrooms;
  feesClasses: TypesOfFees;
  type_list_Fees: any;
  // ckeConfig : any;
  wordsArr: any[] = []
  toggleValueBoolen: boolean = false;
  editorObj = {
    height: 400,
    toolbar_mode: "wrap",
    language: this.translation.getSelectedLanguage(),
    plugins: [
      " visualblocks visualchars fullscreen image link media  template codesample table charmap hr" +
      " pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount" +
      " imagetools textpattern noneditable help charmap" +
      " quickbars emoticons",
    ],
    toolbar:
      "code pageembed tiny_mce_wiris_formulaEditor tiny_mce_wiris_formulaEditorChemistry|" +
      "undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | " +
      "alignleft aligncenter alignright alignjustify" +
      " | outdent indent |  numlist bullist checklist | forecolor backcolor casechange permanentpen " +
      "formatpainter removeformat | pagebreak | charmap | fullscreen  preview save print | " +
      "insertfile image media pageembed template link anchor codesample | a11ycheck ltr rtl | showcomments " +
      "addcomment",
    content_style: `
      .dynamic-text {
        background-color: #0d8ddc !important;
        color: white;
      }
      .dynamic-option {
        background-color: #cc8600;
        color: white;
      }
    `,
  };

  arrobj = {
    0 : []
  };

  selectedCityId: number;
  costCenterId: number;
  selectedCompany: number;
  numberItem: number = 1;
  length_of_item : number = 1;
  id: number;
  items = [];
  words = [
    {
      name: "اسم الشركه",
      value: this.getStyledText("campany_name", "dynamic-option"),
      color: "dynamic-option",
    },
    {
      name: "الرقم الضريبي",
      value: this.getStyledText("tax_number", "dynamic-text"),
      color: "dynamic-text",
    },
    {
      name: "الهويه",
      value: this.getStyledText("identity", "dynamic-text"),
      color: "dynamic-text",
    },
    {
      name: "العقد",
      value: this.getStyledText("contract", "dynamic-text"),
      color: "dynamic-text",
    },
  ];

  itemWords = [
    {
      name: "اسم الشركه",
      value: this.getStyledText("campany_name", "dynamic-option"),
      color: "dynamic-option",
    },
    {
      name: "الرقم الضريبي",
      value: this.getStyledText("tax_number", "dynamic-text"),
      color: "dynamic-text",
    },
    {
      name: "اسم العقد",
      value: this.getStyledText("contract_name", "dynamic-option"),
      color: "dynamic-option",
    },
    {
      name: "الهويه",
      value: this.getStyledText("identity", "dynamic-text"),
      color: "dynamic-text",
    },
    {
      name: "العقد",
      value: this.getStyledText("contract", "dynamic-text"),
      color: "dynamic-text",
    },
    {
      name: "رقم البند",
      value: this.getStyledText("item", "dynamic-text"),
      color: "dynamic-text",
    },
  ];

  selectedFeesList = []; // to disable user from select more than fees that related to one fees class 

  constructor(
    private contractService: ServiceService,
    private fb: FormBuilder,
    private _sharedService: SharedService,
    public translation: TranslationService,
    private copier: CopyContentService,
    private toaster: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private translate: TranslateService,
    private listService: ListsService
  ) { }

  ngOnInit(): void {
    
    // this.ckeConfig = {
    //   language: this.translation.getSelectedLanguage(),
    //   extraPlugins:
    //     "easyimage,dialogui,dialog,a11yhelp,about,basicstyles,bidi,blockquote,clipboard," +
    //     "button,panelbutton,panel,floatpanel,colorbutton,colordialog,menu," +
    //     "contextmenu,dialogadvtab,div,elementspath,enterkey,entities,popup," +
    //     "filebrowser,find,fakeobjects,flash,floatingspace,listblock,richcombo," +
    //     "font,format,forms,horizontalrule,htmlwriter,iframe,image,indent," +
    //     "indentblock,indentlist,justify,link,list,liststyle,magicline," +
    //     "maximize,newpage,pagebreak,pastefromword,pastetext,preview,print," +
    //     "removeformat,resize,save,menubutton,scayt,selectall,showblocks," +
    //     "showborders,smiley,sourcearea,specialchar,stylescombo,tab,table," +
    //     "tabletools,templates,toolbar,undo,wsc,wysiwygarea"
    // };
    this.subscription.add(
      this._sharedService.navChanged$.subscribe((data) => {
        if (data) {
          this.selectedCompany = data.companyNum;
          this.costCenterId = data.costCenter;
          this.getContractById();
          this.getAllEndPoints();
        }
      })
    );
    this.initializeForm();
  }

  getAllEndPoints() {
    this.subscription.add(
      forkJoin([
        this.listService.getFeesClasses(
          this.selectedCompany,
          this.costCenterId
        ),
        this.listService.getClassRoomsList(
          this.selectedCompany,
          this.costCenterId
        ),
      ]).subscribe((res: any) => {
        this.feesClasses = res[0].items;
        this.classRooms = res[1].items;
      })
    );
  }

  targetTheSameProperty() {
    let fees_classes = this.form.get('fees_classes').value;
    let class_room = this.form.get('class_room').value;

    let feesTypesValues = this.form.get('type_list_Fees').value || [];
    let selectedFeesTypes = [];

    if (feesTypesValues.length) {
      feesTypesValues.forEach(id => {
        let element = {};
        element = this.type_list_Fees.find(e => e.id == id);
        if (element) {
          selectedFeesTypes.push(element);
        }
      });
    }



    this.toggleValueBoolen = true;
    this.subscription.add(
      this.contractService.getListFeesType(this.selectedCompany, this.costCenterId, fees_classes, class_room).subscribe((res: any) => {
        this.type_list_Fees = res?.items.filter(e => !selectedFeesTypes.includes(e.id));
        this.type_list_Fees.push(...selectedFeesTypes);
        this.type_list_Fees = [...new Map(this.type_list_Fees.map(item =>
          [item['id'], item])).values()];

      }))
  }

  changeFeesTypes(data){
    let ids = [...new Map(data.map(item =>
      [item['fees_class_id'], item])).values()].map((e:any) => e.id)
    this.form.get('type_list_Fees').setValue(ids)
  }

  getContractById() {
    this.route.queryParams.subscribe((params) => {
      this.id = params["id"];
      if (this.id) {
        // this.length_of_item = 0;
        this.subscription.add(
          this.contractService
            .editContractById(this.id)
            .subscribe((res: any) => {
              console.log(res , 'RES TOTAL')
              this.contractService.getListFeesType(this.selectedCompany, this.costCenterId, res.item.fees_classes.map((res: any) => {
                return res.id
              }), res.item.main.classroom.id).subscribe((res: any) => {
                this.type_list_Fees = res?.items
              })
              setTimeout(() => {
                this.form.patchValue({
                  name: res?.item?.main?.name,
                  class_room: res.item?.main?.classroom.id,

                  contract_party_status:
                    res?.item?.main?.status == 1 ? true : false,
                  intro_title: res?.item?.intro?.title,
                  intro_desc: res?.item?.intro?.desc,
                  intro_status:
                    res?.item?.intro?.status == 1 ? true : false,
                  conclusion_title: res?.item?.conclusion?.title,
                  conclusion_desc: res?.item?.conclusion?.desc,
                  conclusion_status:
                    res?.item?.conclusion?.status == 1 ? true : false,
                  primer_title: res?.item?.primer?.title,
                  primer_status: res?.item?.primer?.status,
                  desc: res?.item?.primer?.desc,

                  signatureOneEdtior: res?.item?.signatures[0]?.desc,
                  signatureOneIsActive: res?.item?.signatures[0]?.status == 1 ? true : false,
                  signatureTwoEdtior: res?.item?.signatures[1]?.desc,
                  signatureTwoIsActive: res?.item?.signatures[1]?.status == 1 ? true : false,

                  fees_classes: res.item.fees_classes.map((res: any) => {
                    return res.id
                  }),

                  type_list_Fees: res.item.fees_types.map((res: any) => {
                    return res.id
                  })
                });

                res.item.items.map((item: any) => {
                  this.addMoreItem(item)
                  // item.removeAt(0)
                });
              });
            })
        );
      }
    });
  }

  //====== START INITIALIZE FORM  ===== //
  initializeForm() {
    this.form = this.fb.group({
      name: ['',Validators.required],
      primer_status: [true, Validators.required],
      desc: ["", Validators.required],
      primer_title: [
        this.translate.instant("contracts.preamble"),
        Validators.required,
      ],
      contract_party_status: [true, Validators.required],
      itemExecutions: this.fb.group({
        item: this.fb.array((this.id) ? [] : [this.addItems()]),
      }),
      intro_title: [
        this.translate.instant("students.intro"),
        Validators.required,
      ],
      intro_desc: ["", Validators.required],
      intro_status: [true, Validators.required],
      conclusion_title: [
        this.translate.instant("contracts.conclusion"),
        Validators.required,
      ],
      conclusion_desc: ["", Validators.required],
      conclusion_status: [true],
      signatureOneEdtior: ["", Validators.required],
      signatureOneIsActive: [true],
      signatureTwoEdtior: ["", Validators.required],
      signatureTwoIsActive: [true],
      fees_classes: ["", Validators.required],
      class_room: ["", Validators.required],
      type_list_Fees: ["", Validators.required],
      fees_status: [true, Validators.required],
    });
  }

  //====== END INITIALIZE FORM  ===== //


  //====== START FORM ARRAY ===== //
  addItems(data?) {
    return this.fb.group({
      title: [
        (data?.title) ? data?.title : this.translate.instant("contracts.dynamicTitle"),
        Validators.required,
      ],
      order: [(data?.order) ? data?.order : this.length_of_item, Validators.required],
      status: [(data?.status) ? data?.status : true],
      desc: [(data?.desc) ? data?.desc : "", Validators.required],
    });
  }

  addMoreItem(data?) {
    this.length_of_item+=1;
    this.itemsArray.push(this.addItems(data));
  }

  get itemsArray() {
    const control = <FormArray>(
      (<FormGroup>this.form?.get("itemExecutions"))?.get("item")
    );
    return control;
  }

  //====== END FORM ARRAY ===== //


  getStyledText(text: string, classes: string): string {
    return `<span class="${classes}">{${text}}</span>`;
  }

  insertDataInsideEditor(words, checkEditor, i?) {
    this.arrobj[`${this.itemsArray.length}`] = [];
    if (checkEditor == "preamble") {
      this.editorComp.editor.execCommand(
        "mceInsertContent",
        true,
        ` ${words} `
      );

    } else if (checkEditor == "conclusion") {
      this.editorForconclusion.editor.execCommand(
        "mceInsertContent",
        true,
        ` ${words} `
      );
    } else if (checkEditor == "contract") {
      this.editorComponentContract.editor.execCommand("mceInsertContent",true,` ${words} `);
    } else if (checkEditor == "item") {
      let new_words = this.itemsArray.controls[i].get('desc').value +'  '+ words
      this.itemsArray.controls[i].get('desc').patchValue(new_words.replace(/<\/?p[^>]*>/g, ""))
    }
    this.toaster.success("تم نسخ النص ولصق النص");
  }

  doCopy(value) {
    this.copier.copyText(value);
    this.toaster.success(
      " تم نسخ النص الان يمكنك لصق النص فى البند الذى تريده"
    );
  }


  sortBeforSubmit() {
    let body = this.prepareBodyBeforeSubmit(this.form.value);
    console.log(body, "BODY");
    this.contractService.createNewContract(body).subscribe(
      (res: any) => {
        this.router.navigateByUrl(
          "financial-operations/contracts-management/view_contract"
        );
      },
      (error) => {
        this.formErrors = error?.error;
      }
    );
    this.itemsArray.value.sort(function (a, b) {
      return a.sort - b.sort;
    });
  }


  prepareBodyBeforeSubmit(formValue) {
    return {
      id: this.id ? this.id : null,
      main: {
        status: formValue.contract_party_status == true ? 1 : 2,
        fees_status: formValue.fees_status == true ? 1 : 2,
        name: formValue?.name,
        classroom_id: this.form.get('class_room').value,
      },
      intro: {
        title: formValue.intro_title,
        desc: formValue.intro_desc,
        status: formValue.intro_status == true ? true : false,
      },
      items: formValue.itemExecutions.item,
      signatures: [
        {
          desc: formValue.signatureOneEdtior,
          order: 1,
          status: formValue.signatureOneIsActive == true ? true : false,
        },
        {
          desc: formValue.signatureTwoEdtior,
          order: 2,
          status: formValue.signatureTwoIsActive == true ? true : false,
        },
      ],
      primer: {
        title: formValue.primer_title,
        desc: formValue.desc,
        status: formValue.primer_status == true ? true : false,
      },
      conclusion: {
        title: formValue?.conclusion_title,
        desc: formValue?.conclusion_desc,
        status: formValue?.conclusion_status == true ? true : false,
      },
      fees_classes: this.form.get('fees_classes').value,
      fees_types: this.form.get('type_list_Fees').value
    };
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
