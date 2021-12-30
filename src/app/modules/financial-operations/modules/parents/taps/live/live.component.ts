import { Component, EventEmitter, Input, NgZone, OnInit, Output, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from "@angular/router";
import { ToastrService } from "ngx-toastr";
import { Subscription } from "rxjs";
import { TranslationService } from "src/app/modules/i18n/translation.service";
import { ParentsService } from "../../service/parents.service";

@Component({
  selector: 'app-live',
  templateUrl: './live.component.html',
  styleUrls: ['./live.component.scss']
})
export class LiveComponent implements OnInit {
  fileToUpload: any;
  imageUrl: any;
  @Input() isEdit
  @Input() addNew
  @Input() dataParents
  @Input() parent_file_id;
  @Output() changeData = new EventEmitter();
  isUserEdit: boolean;
  userAdd: boolean;
  disableAddress = false;

  // parent_file_id;
  map;
  mapClickListener;
  zoom = 6;

  latitude = 24.46498469762461;
  longitude = 39.6172581853578;

  googleMapLink = `24.46498469762461,39.6172581853578`;
  subscription : Subscription = new Subscription();

  constructor(
    private parents: ParentsService,
    private router: ActivatedRoute,
    public lang: TranslationService,
    public toaster: ToastrService,
    private zone : NgZone
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    this.setAddressData();
  }

  ngOnInit(): void {
    this.setAddressData();
    this.checkIsEdit();
  }

  updateGoogleMapLink(lat,lang){
    this.googleMapLink = `${lat},${lang}`;
  }

  handleFileInput(file: FileList) {
    this.fileToUpload = file.item(0);
    //Show image preview
    let reader = new FileReader();
    reader.onload = (event: any) => {
    }
    reader.readAsDataURL(this.fileToUpload);
    const formData = new FormData();
    formData.append('home_image', this.fileToUpload);
    this.subscription.add(
      this.parents.uploadProfileImage(this.parent_file_id, formData).subscribe((res: any) => {
        const date = new Date().getTime();
        this.imageUrl = res?.item?.home_image_path+`?${date}`;
        this.changeData.emit({ type: 'live', data: {type:'img',data:res?.item?.home_image_path} })
      },error => {
        this.imageUrl = this.dataParents?.home_image_path;
      })
    )
  }

  setAddressData(){
    this.imageUrl = this.dataParents?.home_image_path ? this.dataParents?.home_image_path : 'https://via.placeholder.com/1000x600.png' ;
    if(this.dataParents.lat && this.dataParents.lng ){
      this.latitude = +this.dataParents.lat;
      this.longitude = +this.dataParents.lng;
      this.updateGoogleMapLink(this.latitude,this.longitude);
      this.zoom = 10;
    } else {
      this.updateGoogleMapLink(24.46498469762461,39.6172581853578);
      this.latitude = 24.46498469762461;
      this.longitude = 39.6172581853578;
      this.zoom = 8;
    }
  }

  /**
       * Update Map from google map link
       * @param $event
       */
  updateLatLng($event) {
    var URL: string = $event.target.value;

    if (!URL) {
      return
    }

    if (URL.includes('!3d')) {
      var splitUrl = URL.split('!3d');
      var latLong = splitUrl[splitUrl.length - 1].split('!4d');
      var longitude;

      if (latLong.indexOf('?') !== -1) {
        longitude = latLong[1].split('\\?')[0];
      } else {
        longitude = latLong[1];
      }
      var latitude = latLong[0];

      if (latitude && longitude) {
        this.latitude = +latitude;
        this.longitude = +longitude;
        this.zoom = 15;
      }
    } else if(URL.includes('@')) {
      var url = URL.split('@');
      var latLong = url[1].split(',');
      this.latitude = +latLong[0];
      this.longitude = +latLong[1];
      this.zoom = 12;
    } else {
      var url = URL.split(',');
      this.latitude = +url[0];
      this.longitude = +url[1];
      this.zoom = 12;
    }

  }

  markerDragEnd(e){
    this.longitude = e.latLng.lng();
    this.latitude = e.latLng.lat();
    this.updateGoogleMapLink(this.latitude,this.longitude);
    this.zoom = 12;
  }

  saveLocation() {
    const body = {
      "id": this.parent_file_id,
      "father_id": this.dataParents.father_id,
      "mother_id": this.dataParents.mother_id,
      "relative_id": this.dataParents.relative_id,
      "relative_relation_id": this.dataParents.relative_relation_id,
      "parent_id": this.dataParents.parent_id,
      "lat": this.latitude,
      "lng": this.longitude,
      "status": this.dataParents.status,
    }


    this.subscription.add(
      this.parents.createFamilyFile(body).subscribe((res:any) => {
        this.changeData.emit({ type: 'live', data: {type:'location',data:{lat:this.latitude,long:this.longitude}} })
        this.toaster.success(res.message);
      })
    )
  }

  public mapReadyHandler(map: google.maps.Map): void {
    this.map = map;
    this.mapClickListener = this.map.addListener('click', (e: google.maps.MouseEvent) => {
      this.zone.run(() => {
        // Here we can get correct event
        this.latitude =  e.latLng.lat();
        this.longitude =  e.latLng.lng();
        this.updateGoogleMapLink(this.latitude,this.longitude);
        this.zoom = 12;
      });
    });
  }


  checkIsEdit(edit?) {
    if (this.router.snapshot.queryParams?.edit) {
      this.isUserEdit = this.router.snapshot.queryParams?.edit == 'true' || edit ? true : false;
    } else {
      this.userAdd = true;
    }
    this.checkIfUserEditOrAdd();
  }

  checkIfUserEditOrAdd() {
    if (!this.isUserEdit && !this.userAdd) {
      this.disableAddress = true;
    } else {
      this.disableAddress = false;
    }
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }

}
