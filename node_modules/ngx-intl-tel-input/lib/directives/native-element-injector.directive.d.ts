import { ElementRef, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';
import * as ɵngcc0 from '@angular/core';
export declare class NativeElementInjectorDirective implements OnInit {
    private controlDir;
    private host;
    constructor(controlDir: NgControl, host: ElementRef<HTMLFormElement>);
    ngOnInit(): void;
    static ɵfac: ɵngcc0.ɵɵFactoryDef<NativeElementInjectorDirective, never>;
    static ɵdir: ɵngcc0.ɵɵDirectiveDefWithMeta<NativeElementInjectorDirective, "[ngModel], [formControl], [formControlName]", never, {}, {}, never>;
}

//# sourceMappingURL=native-element-injector.directive.d.ts.map