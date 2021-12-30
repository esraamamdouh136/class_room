import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild,} from '@angular/core';
import {AccountGuideService} from '../../services/account-guide/account-guide.service';
import {finalize} from 'rxjs/operators';
import {BehaviorSubject, Subscription} from 'rxjs';
import {MatMenuTrigger} from '@angular/material/menu';
import {TranslationService} from '../../../i18n/translation.service';
import {IActionMapping, ITreeOptions, KEYS, TreeComponent,} from '@circlon/angular-tree-component';
import {MatDialog} from '@angular/material/dialog';
import {AddEditAccountComponent} from './add-edit-account/add-edit-account.component';

import {SharedService} from 'src/app/shared/services/shared.service';
import {LedgerSearchComponent} from './ledger-search/ledger-search.component';
import {LedgerDetailsComponent} from './ledger-details/ledger-details.component';
import {ConfirmDialogComponent} from 'src/app/shared/components/confirm-dialog/confirm-dialog.component';
import {environment} from 'src/environments/environment';
import {ToastrService} from 'ngx-toastr';
import { Router } from "@angular/router";

/**
 * Food data with nested structure.
 * Each node has a name and an optional list of children.
 */
export interface GuidTree {
  id?: number;
  mother_company_id?: number;
  title_ar?: string;
  title_en?: string;
  code?: number;
  power?: number;
  level?: number;
  warnings?: string;
  account_type?: string;
  note?: string;
  account_guide_id?: number;
  created_at?: string;
  updated_at?: string;
  all_children?: GuidTree[];
}

@Component({
  selector: 'app-chart-of-accounts',
  templateUrl: './chart-of-accounts.component.html',
  styleUrls: ['./chart-of-accounts.component.scss'],
})
export class ChartOfAccountsComponent implements OnInit, OnDestroy {
  // Tree
  @ViewChild('actionsMenu') actionsMenu: MatMenuTrigger;

  @ViewChild('firstTree', {static: true}) firstTree: ElementRef;
  @ViewChild('secondTree', {static: true}) secondTree: ElementRef;
  @ViewChild('tree') tree: TreeComponent;
  contextMenuPosition = {x: '0px', y: '0px'};
  treeData: GuidTree[] = [];
  searchQuery = '';

  dir;
  dataLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  subscription: Subscription = new Subscription();


  nodes = [];
  SecondList = [];
  isUpdating = false;

  actionMapping: IActionMapping = {
    mouse: {
      click: (tree, node, $event) => {

        this.SecondList = [node.data];
      },
    },
    keys: {
      [KEYS.ENTER]: (tree, node, $event) => alert(`This is ${node.data.name}`),
    },
  };

  mainOptions: ITreeOptions = {
    rtl: true,
    childrenField: 'all_children',
    displayField: `nodeName`,
    // levelPadding: 20,
    nodeHeight: 50,
  };

  firstListOptions: ITreeOptions = {
    ...this.mainOptions,
    actionMapping: this.actionMapping,
  };

  secondListOptions: ITreeOptions = {
    ...this.mainOptions,
    actionMapping: {
      mouse: {
        contextMenu: (tree, node, $event) => {

          this.onContextMenu($event, node.data);
        },
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) =>
          alert(`This is ${node.data.name}`),
      },
    },
  };


  constructor(
    private accountGuideService: AccountGuideService,
    public translationService: TranslationService,
    private matDialog: MatDialog,
    private ref: ChangeDetectorRef,
    private _shared: SharedService,
    private toast: ToastrService,
    private router: Router,
  ) {
  }


  ngOnInit(): void {
    this.subscription.add(
      this._shared.navChanged$.subscribe(data => {
        if (data) {
          this.getAccountGuideTree();
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // Search => these two function work but does not get the children
  filter() {
    this.tree.treeModel.filterNodes(this.searchQuery, true);
  }

  parentReceivable(node): void {
    console.log(node);
    
    this.subscription.add(
      this.accountGuideService.makeParentReceivable(node?.id)
        .subscribe(
          (res) => {
            this.toast.success(res.message);
          }, err => {
            this.toast.error(err?.error?.account_guide_id?.map(x => x));
          }
        )
    );
  }

  getAccountGuideTree(): void {
    this.dataLoaded.next(false);
    this.subscription.add(
      this.accountGuideService
        .getGuideTree()
        .pipe(finalize(() => this.dataLoaded.next(true)))
        .subscribe((res) => {
          this.treeData = res;
          // =======[Gad]===========
          this.nodes = this.changeName(res);
          if (this.isUpdating) {
            // this.SecondList = this.nodes?.filter(n => n.id === this.SecondList[0]?.id);
            this.updateSpecificNode(this.nodes);
            this.isUpdating = false;
          }

        })
    );
  }

  updateSpecificNode(tree): void {
    for (const node of tree) {
      if (node?.all_children?.length) {
        if (this.SecondList[0]?.id === node.id) {
          this.SecondList = [node];
        } else {
          this.updateSpecificNode(node?.all_children);
        }
      } else {
        if (this.SecondList[0]?.id === node.id) {
          this.SecondList = [node];
        }
      }
    }
  }

  onContextMenu(event: MouseEvent, node) {

    event.preventDefault();
    this.contextMenuPosition.x = event.clientX + 'px';
    this.contextMenuPosition.y = event.clientY + 'px';
    // =============[Gad]===============
    this.actionsMenu.menuData = {node};
    this.actionsMenu.menu.focusFirstItem('mouse');
    this.actionsMenu.openMenu();
  }

  expand(node) {
    if (node === '*') {
      this.tree.treeModel.expandAll();
    } else if (node === '-') {
      this.tree.treeModel.collapseAll();
    } else {
      this.expandCertainNode(this.tree.treeModel.nodes, node);
    }
  }


  // ===================[New tree]========================

  expandCertainNode(data, expandNode) {

    for (let i = 0; i < data.length; i++) {
      if (data[i].level <= Number(expandNode)) {
        const node = this.tree.treeModel.getNodeById(data[i].id);
        node.expand();
        if (data[i].all_children.length) {

          this.expandCertainNode(data[i].all_children, expandNode);
        }
      }
    }
  }

  changeName(data) {
    return data?.map((el) => {
      el['nodeName'] = `${el.code}- ${el.title_ar}`;
      if (el.all_children.length) {
        this.changeName(el.all_children);
      }
      return el;
    });
  }

  onExpand(e) {
    setTimeout(() => {
      this.secondTree.nativeElement.style.height = this.firstTree.nativeElement.offsetHeight + 'px';
    }, 0);
  }

  openAddEditAccountDialog(node?: any, addSub?: boolean): void {
    const dialogRef = this.matDialog.open(AddEditAccountComponent, {
      data: {...node, addSub},
      panelClass: 'custom-dialog-container',
      width: '800px',
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.isUpdating = true;
          this.getAccountGuideTree();
        }
      }
    );
  }


  openLedgerDialog(node?): void {
    const dialogRef = this.matDialog.open(LedgerSearchComponent, {
      data: {
        node: node ? {...node} : '',
        list: this.treeData
      },
      panelClass: 'custom-dialog-container',
      width: '500px',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result?.close) {
          const url = this.router.serializeUrl(
            this.router.createUrlTree([`ledger-view`])
          );
          localStorage.setItem('ledgerViewData',JSON.stringify(result));
          window.open(url, '_blank');
          // this.openLedgerDetailsDialog(result);
        }
      }
    );
  }

  openLedgerDetailsDialog(dialogResult?): void {
    const dialogRef = this.matDialog.open(LedgerDetailsComponent, {
      data: {tableData: dialogResult?.data, headerData: dialogResult?.headerData},
      panelClass: ['custom-dialog-container', 'full-screen-modal'],
      width: '100vw',
      height: '100vw',
      autoFocus: false
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {

        }
      }
    );
  }

  openDeleteDialog(dialogResult?): void {
    const dialog = this.matDialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        message: 'common.deleteMessage',
        updateStatus: false,
        url: `users/account_guide/${dialogResult.id}/delete`,
        domainUrl: `${environment.accountant_apiUrl}`
      }
    });
    this.subscription.add(
      dialog.afterClosed().subscribe(res => {
        if (res) {
          this.isUpdating = true;
          this.getAccountGuideTree();
          if (!this.SecondList[0]?.all_children?.length) {
            this.SecondList = [];
          }
        }
      }));
  }


}
