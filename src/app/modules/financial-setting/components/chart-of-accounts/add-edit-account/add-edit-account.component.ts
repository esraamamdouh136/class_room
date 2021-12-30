import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Currencies, GuideTree} from '../../../../../shared/model/global';
import {SharedService} from '../../../../../shared/services/shared.service';
import {AccountGuideService} from '../../../services/account-guide/account-guide.service';
import {TranslationService} from '../../../../i18n/translation.service';
import { TranslateService } from '@ngx-translate/core';
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
    selector: 'app-add-edit-account',
    templateUrl: './add-edit-account.component.html',
    styleUrls: ['./add-edit-account.component.scss']
})
export class AddEditAccountComponent implements OnInit, OnDestroy {

    formErrors: any;
    form: FormGroup;
    subscription: Subscription = new Subscription();
    selectedCompany: number;
    selectedCompanyId: number;
    fiscalYearId: number;
    guideTree: GuideTree[] = [];
    currencies: Currencies[] = [];
    isEditing = false;
    isNew = false;
    editEnabled = false;
    addingSub = false;
    nameOfEnglish : boolean;
    nameofArabic : boolean;
    mappedTree: GuideTree[] = [];
    language:string;


    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        private dialog: MatDialogRef<AddEditAccountComponent>,
        private formBuilder: FormBuilder,
        private listsService: ListsService,
        private sharedService: SharedService,
        private accountGuideService: AccountGuideService,
        public translateService: TranslationService,
        private translate : TranslateService

    ) {
    }

    ngOnInit(): void {
        this.subscription.add(
            this.sharedService.selectedCompanyNumber.subscribe(res => {
                this.selectedCompany = res;
            }));

        this.subscription.add(
            this.sharedService.selectedCompanyId.subscribe(res => {
                this.selectedCompanyId = res;
            }));

        this.subscription.add(
            this.sharedService.selectedFiscalYearId.subscribe(res => {
                this.fiscalYearId = res;
                this.getCurrencies();
            }));

        this.getAccountGuideTree();

        this.initForm();
        this.fillForm();
        this.defualtLanguageInputs();
    }

    defualtLanguageInputs(){
        if(this.translateService.getSelectedLanguage() == 'ar'){
          this.language = this.translate.instant('MENU.en_language')
          this.nameOfEnglish = false;
          this.nameofArabic = true;
        }
        else{
          this.language = this.translate.instant('MENU.ar_language')
          this.nameOfEnglish = true;
          this.nameofArabic = false;
        }
      }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    fillForm(): void {
        if (!this.data?.id) {
            this.isNew = true;
        }
        if (this.data?.id && !this.data?.addSub) {
            this.form.patchValue(this.data);
            this.isEditing = true;
            this.disableForm();
        } else if (this.data?.addSub) {
            this.accountGuideId.setValue(this.data?.id);
            this.getCode(this.data?.id);
        }
    }

    disableForm(): void {
        this.form.disable();
    }

    enableForm(): void {
        this.form.enable();
        if (this.isEditing && !this.data?.account_guide_id) {
            this.accountGuideId.disable();
        }
    }

    get accountGuideId() {
        return this.form.get('account_guide_id');
    }

    get codeControl() {
        return this.form.get('code');
    }

    get accountType() {
        return this.form.get('account_type');
    }


    getCode(parentId: number) {
        this.accountGuideService.getCode(parentId)
            .subscribe(
                (res) => {
                    this.codeControl.setValue(res?.item);
                }
            );
    }


    initForm() {
        this.data?.id && !this.data?.addSub ? this.isEditing = true : this.isNew = true;
        this.data?.addSub ? this.addingSub = true : this.addingSub = false;
        this.form = this.formBuilder.group({
            title_ar: ['', Validators.required],
            title_en: ['', Validators.required],
            code: ['', Validators.required],
            account_guide_id: [null, this.isNew || this.data?.account_guide_id || this.data?.addSub ? Validators.required : []],
            warnings: ['', Validators.required],
            currency_id: [null, Validators.required],
            note: [''],
            account_type: ['']
        });
    }

    getAccountGuideTree(): void {
        this.subscription.add(
            this.accountGuideService
                .getGuideTreeFlattened(this.selectedCompany)
                .subscribe(
                    (res) => {
                        // this.mapGuide(res);
                        this.guideTree = res;
                    }
                ));
    }

    accountGuideChanged(evt): void {
        if (evt) {
            this.getCode(evt?.id);
        } else {
            this.codeControl.setValue(null);
        }
    }

    mapAccountGuideTree(tree: GuideTree[]): GuideTree[] { // old method

        const flattenedNode = [];

        for (const node of tree) {
            if (node.all_children === [] || node.all_children == null) {
                flattenedNode.push(node);
            } else {
                flattenedNode.push(node);
                const child = node.all_children;
                flattenedNode.push(...child);
                for (const n of child) {
                    flattenedNode.push(n);
                    if (n?.all_children?.length || n?.all_children !== null) {
                        flattenedNode.push(...n.all_children);
                    }
                }
            }
        }

        this.removeAllChildren(flattenedNode);

        return flattenedNode;

    }

    mapGuide(tree: GuideTree[]): void {
        for (const node of tree) {
            if (node?.all_children?.length) {
                const currentNode = JSON.parse(JSON.stringify(node));
                delete currentNode.all_children;
                this.mappedTree.push(currentNode);
                this.mapGuide(node.all_children);
            } else {
                this.mappedTree.push(node);
            }
        }
        this.guideTree = this.mappedTree;
    }

    removeAllChildren(items: GuideTree[]): void {
        items?.forEach(item => {
            delete item?.all_children;
        });
    }

    mapFlattenedTree(flattenedTree: GuideTree[]): GuideTree[] {
        return flattenedTree?.map(node => {
            return {
                ...node,
                name: this.translateService.getSelectedLanguage() === 'ar' ? node?.title_ar : node?.title_en
            };
        });
    }

    getCurrencies(): void {
        this.subscription.add(this.listsService
            .getCurrencies(this.selectedCompany, this.fiscalYearId)
            .subscribe(
                (res) => {
                    this.currencies = res.items;
                }
            ));
    }

    onSubmit(): void {
        this.setValue()
        if (this.isNew) {
            this.subscription.add(
                this.accountGuideService.addSubAccount(this.accountGuideId.value, this.form.getRawValue())
                    .subscribe(
                        (res) => {
                            this.dialog.close(true);
                        }
                    ,error => {
                        this.formErrors = error?.error;
                    })
            );
        } else if (this.isEditing) {
            this.accountType.setValue('both');
            this.subscription.add(
                this.accountGuideService.updateAccount(this.data?.id, this.form.getRawValue())
                    .subscribe(
                        (res) => {
                            this.data = this.form.getRawValue();
                            // editEnabled = !editEnabled
                            this.dialog.close(this.data);
                            this.disableForm();
                        }
                    ,error => {
                        this.formErrors = error?.error;
                    })
            );
        
        }
    }

    setValue(){
        if(this.form.get('title_ar').value == ''){
            this.form.controls['title_ar'].setValue(this.form.get('title_en').value)
          }
         else if(this.form.get('title_en').value == ''){  
            this.form.controls['title_en'].setValue(this.form.get('title_ar').value)
          }  
    }

    toggleLanguage(){
        if(this.nameofArabic == true){
          this.language = this.translate.instant('MENU.ar_language')
            this.nameOfEnglish = true;
            this.nameofArabic = false;
        }
        else if(this.nameOfEnglish == true){
          this.language = this.translate.instant('MENU.en_language')
            this.nameOfEnglish = false;
            this.nameofArabic = true
        }
      }
}
