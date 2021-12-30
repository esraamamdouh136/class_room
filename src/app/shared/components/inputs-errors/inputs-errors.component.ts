import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { SharedService } from "../../services/shared.service";

@Component({
  selector: 'app-inputs-errors',
  templateUrl: './inputs-errors.component.html',
  styleUrls: ['./inputs-errors.component.scss']
})
export class InputsErrorsComponent implements OnInit, OnChanges {
  @Input() ctrl: FormControl
  @Input() name: string
  @Input() name_ar: string
  @Input() name_en: string
  serverErrors: {}
  constructor(public shared: SharedService) { }

  ngOnInit() {
    this.shared.serverErrors$.subscribe(errors => {
      this.serverErrors = { ...errors }
    })
  }
  ngOnChanges(changes: SimpleChanges) {
  }

}
