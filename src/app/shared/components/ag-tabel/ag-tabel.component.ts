import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output,
    SimpleChange,
    SimpleChanges,
    ViewChild
} from '@angular/core';
import {MatSort, Sort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from '@angular/material/paginator';
import {TranslationService} from '../../../modules/i18n/translation.service';

export interface TableColumn {
    name: string;
    dataKey: string;
    position?: 'right' | 'left';
    isSortable?: boolean;
    show?: boolean;
}

@Component({
    selector: 'app-ag-tabel',
    templateUrl: './ag-tabel.component.html',
    styleUrls: ['./ag-tabel.component.scss']
})
export class AgTabelComponent implements OnInit {

    // This line to solve cashed user image after update
    time = new Date().getTime();
    public tableDataSource = new MatTableDataSource([]);
    public displayedColumns: string[];
    filters = {keyword: '', roles: [], status: []};
    expandedElement;
    @ViewChild(MatPaginator, {static: false}) matPaginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) matSort: MatSort;

    @Input() isPageable = false;
    @Input() isSortable = false;
    @Input() isFilterable = false;
    @Input() rowActions: string[];
    @Input() pageOptions = {
        paginationSizes: [5, 10, 15],
        defaultPageSize: 5,
        length: 10
    };
    @Input() alignTableCenter = false;
    // @Input() vacationOrexcecuseRequest = false;
    @Input() type;

    page = 1;
    @Output() sort: EventEmitter<Sort> = new EventEmitter();
    @Output() rowAction: EventEmitter<any> = new EventEmitter<any>();
    @Output() filtersEmitter: EventEmitter<any> = new EventEmitter<any>();
    @Output() pageEvent: EventEmitter<any> = new EventEmitter<any>();

    rowActionsList: { type: string, icon: string }[];
    // this property needs to have a setter, to dynamically get changes from parent component
    @Input() tableColumns: TableColumn[];

    @Input() set tableData(data: any) {
        this.setTableDataSource(data);
    }


    constructor(
        private changeDeetc: ChangeDetectorRef,
        public translationService: TranslationService) {
    }



    ngOnInit(): void {
        this.prepareColons();
        this.mapActions();
    }

    prepareColons() {
        this.displayedColumns = this.tableColumns.filter(e => {
            e.show = e.show == undefined ? true : e.show;
            return e.show;
        }).map((tableColumn: TableColumn) => tableColumn.name);
        this.displayedColumns = [...this.displayedColumns, 'ACTIONS'];
    }

    // we need this, in order to make pagination work with *ngIf
    ngAfterViewInit(): void {
        //this.tableDataSource.paginator = this.matPaginator;
    }

    mapActions() {
        this.rowActionsList = this.rowActions?.map(action => {
            return {
                type: action,
                icon: this.handleActionsIcons(action)
            };
        });
    }


    setTableDataSource(data: any) {
        this.tableDataSource = new MatTableDataSource<any>(data);
        this.changeDeetc.detectChanges();
        //this.tableDataSource.paginator = this.matPaginator;
        this.tableDataSource.sort = this.matSort;
    }

    applyFilter(event?: Event) {
        if (event) {
            const filterValue = (event.target as HTMLInputElement).value;
            this.tableDataSource.filter = filterValue.trim().toLowerCase();
        } else {
            this.filtersEmitter.emit(this.filters);
        }
    }

    sortTable(sortParameters: Sort) {

        // defining name of data property, to sort by, instead of column name
        sortParameters.active = this.tableColumns.find(column => column.name === sortParameters.active).dataKey;
        this.sort.emit(sortParameters);
    }

    emitRowAction(row: any, action) {
        this.rowAction.emit({row, action});
    }

    handleActionsIcons(action) {
        let icons = {
            'view': 'eye',
            'delete': 'trash-alt',
            'edit': 'edit',
            'add': 'eye',
            'permission': 'lock'
        };
        return icons[action] ? icons[action] : 'add';
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes?.tableColumns && !changes?.tableColumns.firstChange) {
            this.tableColumns = changes?.tableColumns.currentValue;
            this.prepareColons();
        }
        this.getNewTime();
    }

    /**
     * After every update of table date (when update user image)
     * Because the new image url is the same as old url
     * The browser cashed the old image that has the same url
     * The new image does not change because of this behavior (cashed image by name)
     * So After every change we get the current time and add new query param to the image url
     * So the browser detected the url change and update the image
     */
    getNewTime() {
        let data = new Date();
        this.time = data.getTime();
    }
}
