import { Subject, Subscription } from "rxjs";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Directive, EventEmitter, HostListener, OnDestroy, OnInit, Output, Input } from '@angular/core';

@Directive({ selector: '[appDebounceInputChange]' })
export class DebounceInputChangeDirective implements OnInit, OnDestroy {
    private values = new Subject();
    private subscription: Subscription;

    @Input() debounceTime = 500;
    @Output() valueChanged = new EventEmitter();

    constructor() { }

    ngOnInit() {
        this.subscription = this.values
            .pipe(debounceTime(this.debounceTime), distinctUntilChanged())
            .subscribe((e: string) => this.valueChanged.emit(e));
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    @HostListener("input", ["$event"])
    public onValueChange(event): void {
        this.values.next(event.target.value);
    }
}