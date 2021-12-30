import { HttpErrorResponse } from "@angular/common/http";
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessagesService } from "src/app/shared/services/messages/messages.service";
import { ConnectEducation } from "../../services/connect-education/connnect-education.service";

@Component({
  selector: 'app-connect-education-system',
  templateUrl: './connect-education-system.component.html',
  styleUrls: ['./connect-education-system.component.scss']
})
export class ConnectEducationSystemComponent implements OnInit {
  form:FormGroup;
  formsError:any = {};

  constructor(
    private fb:FormBuilder,
    private _connect:ConnectEducation,
    private _messages:MessagesService,
  ) { }

  ngOnInit(): void {
    this.initdForm();
  }

  initdForm(){
    this.form = this.fb.group({
      username : ['',Validators.required],
      password : ['',Validators.required],
    })
  }

  onSubmit(){
    this._connect.connectToEducationSystem(this.form.value).subscribe((res:any) => {
      console.log(res);
      this._messages.showSuccessMessage(res.message);
    },(error:HttpErrorResponse) => {
      if(error.status == 422){
        this.formsError = error.error;
      }
    })
  }

}
