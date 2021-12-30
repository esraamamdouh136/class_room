import { Component, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { ParentsService } from './service/parents.service';
import { Subscription } from 'rxjs';
import { FatherComponent } from './taps/father/father.component';
import { SharedService } from 'src/app/shared/services/shared.service';
import { MotherComponent } from './taps/mother/mother.component';
import { RelativesComponent } from './taps/relatives/relatives.component';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { ChildrenComponent } from './taps/children/children.component';
import * as moment from 'moment';
import { ToastrService } from 'ngx-toastr';
import { TranslationService } from '../../../i18n/translation.service';
import { LiveComponent } from "./taps/live/live.component";
import { ListsService } from "src/app/shared/services/list_Service/lists.service";

@Component({
    selector: 'app-parents',
    templateUrl: './parents.component.html',
    styleUrls: ['./parents.component.scss']
})
export class ParentsComponent implements OnInit, OnDestroy {
    @ViewChild(FatherComponent) father: FatherComponent;
    @ViewChild(MotherComponent) mother: MotherComponent;
    @ViewChild(RelativesComponent) relation: RelativesComponent;
    @ViewChild(ChildrenComponent) childrenComponent: ChildrenComponent;
    @ViewChild(LiveComponent) LiveComponent: LiveComponent;
    parentsData;
    parentsid;
    parents_identification_number;
    formErrors;
    viewMode: string = 'father';
    children;
    parent_file_id: number;
    relatives_relations;
    relationsData;
    selectedMotherCompanyNumber;
    selectedConstCenterNumber;
    selectedFiscalYearId;
    classRooms;
    semsters;
    countryName;
    caseStudiesList = [];
    subscription: Subscription = new Subscription();
    countries;
    isUserEdit: boolean;
    userAdd: boolean;
    isUserAdd: boolean;
    showChild: boolean;
    markAsParentSelected: any;
    constructor(
        public lang: TranslationService,
        private parentsService: ParentsService,
        private _shredService: SharedService,
        private _listsService: ListsService,
        private translation: TranslateService,
        private router: ActivatedRoute,
        private sharedService: SharedService,
        private toaster: ToastrService,
    ) {
    }

    ngOnInit(): void {
        this.parent_file_id = this.router.snapshot.queryParams?.id;
        this.getData();
        this.checkIsEdit();
        this.getIP();
    }

    getData() {
        this.subscription.add(
            this._shredService.navChanged$.subscribe(data => {
                if (data) {
                    this.selectedFiscalYearId = data?.fiscalYear;
                    this.selectedMotherCompanyNumber = data?.companyNum;
                    this.selectedConstCenterNumber = data?.costCenter;
                    this.getClassRooms();
                    this.getSemsters();
                    this.getCaseStudies();
                    this.getRelations();
                    this.getCountries();
                }
            })
        );
    }

    checkIsEdit() {
        if (this.router.snapshot.queryParams?.edit) {
            if (this.router.snapshot.queryParams?.edit == 'true') {
                this.isUserEdit = true;
                this.parentsService.getFileById(this.parent_file_id).subscribe(res => {
                    this.parentsData = this.mapData(res.data?.item);
                });
            } else {
                this.isUserEdit = false;
                this.parentsService.getFileById(this.parent_file_id).subscribe(res => {
                    this.parentsData = this.mapData(res.data?.item);
                });
            }
        } else {
            this.userAdd = true;
            this.parentsData = {};
        }
    }


    edit() {
        if (this.viewMode == 'father') {
            this.father.checkIsEdit(true);
        }
        if (this.viewMode == 'mother') {
            this.mother.checkIsEdit(true);
        }
        if (this.viewMode == 'relative') {
            this.relation.checkIsEdit(true);
        }
        if (this.viewMode == 'tab4') {
            this.childrenComponent.checkIsEdit(true);
        }
        if (this.viewMode == 'tab5') {
            this.LiveComponent.checkIsEdit(true);
        }
    }

    changeFamilyId(e) {
        this.parent_file_id = e;
        this.isUserAdd = false;
    }


    changeFatherData(data) {
        this.parentsData['father'] = data;
        let type = 'fa';
        if (data?.mark_as_parent == null || (!data?.mark_as_parent && this.markAsParentSelected?.type != type)) {
            return
        }
        this.markAsParentSelected = data?.mark_as_parent ? { val: true, type } : {}
    }

    changeMotherData(data) {
        this.parentsData['mother'] = data;
        let type = 'ma';
        if (data?.mark_as_parent == null || (!data?.mark_as_parent && this.markAsParentSelected?.type != type)) {
            return
        }
        this.markAsParentSelected = data?.mark_as_parent ? { val: true, type } : {}
    }

    changeRelativeData(data) {
        this.parentsData['relative'] = data;
        let type = 're';
        if (data?.mark_as_parent == null || (!data?.mark_as_parent && this.markAsParentSelected?.type != type)) {
            return
        }
        this.markAsParentSelected = data?.mark_as_parent ? { val: true, type } : {}
    }

    changeChildData(data) {
        this.parentsData['students'] = data;
    }

    changeLiveData(data) {
        if(data.type == 'img'){
            this.parentsData['home_image_path'] = data.data;
        } else {
            this.parentsData['lat'] = data.data.lat;
            this.parentsData['lng'] = data.data.long;
        }
    }

    /**
     *
     * @param {object} e {type,data,isFirstAdd}
     * isFirstAdd (to check if user add first time to navigate to child tab)
     */
    changeData(e) {
        if (this.parentsData) {
            this.initializeJumbTable(e?.type, e?.data);
        }
    }

    initializeJumbTable(name, val) {
        const jumbTable = {
            father: this.changeFatherData.bind(this),
            mother: this.changeMotherData.bind(this),
            relative: this.changeRelativeData.bind(this),
            child: this.changeChildData.bind(this),
            live: this.changeLiveData.bind(this),
        }
        jumbTable[name](val);
    }

    // pagination oages
    getFileById(type) {
        this.subscription.add(this.parentsService.getSearchById(this.parent_file_id, type).subscribe((res: any) => {
            this.parentsData = this.mapData(res.data?.item);
            this.parent_file_id = res.data?.item?.id;
        }));
    }

    mapData(data) {
        return {
            ...data,
            relative: { ...data.relative, relative_id: data?.relative_id, relative_relation_id: data?.relative_relation_id }
        };
    }

    // =======

    getRelations() {
        this.subscription.add(this.parentsService.getRelations(this.selectedMotherCompanyNumber).subscribe((res: any) => {
            this.relatives_relations = res.items;
        }));
    }

    getSemsters() {
        this.subscription.add(this._listsService.getSemster(this.selectedMotherCompanyNumber, this.selectedConstCenterNumber, this.selectedFiscalYearId).subscribe((res: any) => {
            this.semsters = res.items;
        }));
    }

    getClassRooms() {
        this.subscription.add(this._listsService.getClassRoomsList(this.selectedMotherCompanyNumber, this.selectedConstCenterNumber).subscribe((res: any) => {
            this.classRooms = res.items;
        }));
    }

    getCountries() {
        this.subscription.add(this._listsService.countries().subscribe((res: any) => {
            this.countries = res?.items;
        }));
    }

    getCaseStudies() {
        this.subscription.add(this._listsService.getCaseStudies(this.selectedMotherCompanyNumber, this.selectedConstCenterNumber).subscribe((res: any) => {
            this.caseStudiesList = res?.items;
        }));
    }

    sarechById(id) {
        this.subscription.add(this.parentsService.getSearchById(id).subscribe((res: any) => {
            this.parentsData = this.mapData(res.data?.item);
            this.parent_file_id = res.data?.item?.id;
        }));
    }

    onSave() {
        const body = this.prepareDataBeforeSend(this.parentsData);
        this.subscription.add(this.parentsService.storeAllFiles(body).subscribe((res: any) => {
            this.toaster.success(res?.message);
            this.formErrors = {};
            this.showChild = true;
            this.viewMode = 'tab4';
        }, error => {
            this.formErrors = error?.error;
            this.viewMode = Object.keys(this.formErrors)[0];
        }));
    }

    prepareDataBeforeSend(data) {
        if (!data?.mother?.mark_as_parent && !data?.relative?.mark_as_parent) {
            data.father.mark_as_parent = true;
        }
        const father = { ...data?.father, identity_date: data?.father?.identity_date ?  moment(data?.father?.identity_date).format('DD/MM/YYYY') : null };
        const mother = { ...data?.mother, identity_date: data?.mother?.identity_date ?  moment(data?.mother?.identity_date).format('DD/MM/YYYY') : null };
        const relative = { ...data?.relative, identity_date: data?.relative?.identity_date ?  moment(data?.relative?.identity_date).format('DD/MM/YYYY') : null };
        return {
            parents_file_id: data?.id ? data?.id : this.parent_file_id,
            father: this.removeNullValues(father),
            mother: this.removeNullValues(mother),
            relative: this.removeNullValues(relative)
        };
    }

    removeNullValues(obj) {
        Object.keys(obj).forEach(key => {
            if(!obj[key] && key == 'mark_as_parent'){
                obj[key] = false;
            }

            if (!obj[key] && key != 'mark_as_parent') {
                delete obj[key];
            }
        });

        return obj;
    }

    nextTab(e) {
        this.viewMode = e;
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    getIP() {
        this.parentsService.getIPAddress().subscribe((res: any) => {
            this.countryName = res.countrycode.toLocaleLowerCase();
        });
    }
}
