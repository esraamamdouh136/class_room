import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ContractsService } from '../../../service/contracts/contracts.service';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-download-contract',
  templateUrl: './download-contract.component.html',
  styleUrls: ['./download-contract.component.scss']
})
export class DownloadContractComponent implements OnInit {
  // downloadOptions = {
  //   orientation: 'P',
  //   format: 'A4',
  //   margin_left: '5',
  //   margin_top: '5',
  //   margin_right: '5',
  //   margin_bottom: '5',
  //   save_file: 1,
  // }
  form: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private _contract: ContractsService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.initForm()
  }

  initForm(){
    this.form = this.formBuilder.group({
      orientation: ['P', Validators.required],
      format: ['A4', Validators.required],
      marginLeft: ['5', Validators.required],
      marginTop: ['5', Validators.required],
      marginRight: ['5', Validators.required],
      marginBottom: ['5', Validators.required],
    });
  }
  onsubmit(){
    this._contract.downloadContract(this.data?.id,this.form.value).subscribe(res =>{
      saveAs(res);
    })
  }
}
