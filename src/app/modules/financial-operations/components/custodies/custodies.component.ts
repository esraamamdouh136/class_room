import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';

@Component({
  selector: 'app-custodies',
  templateUrl: './custodies.component.html',
  styleUrls: ['./custodies.component.scss']
})
export class CustodiesComponent implements OnInit {


  @ViewChild('video') videoElementRef: ElementRef;

  get videoElement(): HTMLVideoElement {
    return this.videoElementRef.nativeElement;
  }

  constructor() {
  }

  ngOnInit(): void {
    this.startRecording();
  }

  async startRecording() {
    // // navigator.mediaDevices.getDisplayMedia({ video: true })
    // // or
    // // navigator.getDisplayMedia({ video: true })
    //
    // const mediaDevices = navigator.mediaDevices as any;
    // const stream = await mediaDevices.getDisplayMedia({video: true});
    //
    // this.videoElement.srcObject = stream;
  }

}
