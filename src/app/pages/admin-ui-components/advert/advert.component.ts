import {config, Observable, of} from 'rxjs';
import { Component, OnInit, ViewChild, ElementRef, TemplateRef } from '@angular/core';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config/config-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { switchMap, map } from 'rxjs/operators';

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.css']
})
export class AdvertComponent implements OnInit {

  @ViewChild('adverDetail',{static:false}) advertDetail :TemplateRef<any>
  limt: number = 500;
  skip: number = 0;
  isActive = false;
  addform: FormGroup
  queryParam: string = `?limit=${this.limt}&skip=${this.skip}`;
  private imageUrl: Array<any> = [];
  private advertisments: [];
  advertisment: any;
  private addImage: Array<string>=[];
  advertimage: any[]=[];

  constructor(private sanitizer: DomSanitizer, private snackBar: MatSnackBar, private config: ConfigService, private service: ProviderService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.initializeForm();
  }
  ngOnInit() {
    this.getAllAdds();
  }

  //Init Form
  initializeForm(){
    this.addform = this.formBuilder.group({
      title: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(30)]],
      content: ['', [Validators.required, Validators.minLength(100), Validators.maxLength(700)]],
      link: [''],
      owner: [''],
      min: ['15', [Validators.required, this.minAge.bind(this)]],
      max: ['', [Validators.required, this.maxAge.bind(this)]],
      avatar: [null]
    });
  }

  getAllAdds() {
    //retiriving allads
    this.isActive = !this.isActive;
    console.log(this.isActive)
    this.service.get(API_TYPE.ADMIN, 'ads', this.queryParam).pipe(
      switchMap(
      (res)=> this.requestImages(res))
    ).subscribe((res: []) => {
      console.log("advertisments", res);
    }, (err) => {
      console.log(err);
    },
      () => {
        console.log("complate");
      })

  }

  displayForm() {
    this.isActive = !this.isActive;
  }

  onsubmit() {
    //populating form data
    var formData: any = new FormData();
    formData.append("title", this.addform.get('title').value);
    formData.append("content", this.addform.get('content').value);
    formData.append("link", this.addform.get('link').value);
    let ageGroupTarget = { min: this.addform.get('min').value, max: this.addform.get('max').value }
    formData.append('age_target', JSON.stringify(ageGroupTarget) ? JSON.stringify(ageGroupTarget) : '');
    formData.append("owner", '5e8a6e7a313b41e794ab1045')
    formData.append("target_location", '[0,0]')

    //appending the baanners to form data
    let filess: Array<File> = this.addform.get('avatar').value;
    for (let i = 0; i < filess.length; i++) {
      formData.append("banner", filess[i], filess[i]['name']);
    }
    //multipart header
    const httpOptions = {
      headers: this.config.getHeadersMultipart()
    }

    //sending request to server
    this.service.formdataPost(API_TYPE.ADMIN, 'ads', formData, httpOptions).subscribe((res) => {
      this.snackBar.open('Advertisment created successfully', 'Ok')
      this.imageUrl=[];
      //displaying advertisment list
      this.isActive = false;

    }, error => {
      console.log(error);
      this.snackBar.open('Unable to create advertismnet', 'Ok')

    })

    //reseting form
    this.initializeForm();

  }




  async uploadFile(event) {

    //retiving selected images
    let files: FileList
    files = (event.target as HTMLInputElement).files;

    //checking mime tipe
    for (let i = 0; i < files.length; i++) {
      this.imageUrl = [];
      var mimeType = files[i].type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }

      //Iimages to display on the template
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl.push(e.target.result);
      }
      reader.readAsDataURL(files[i]);
    }
    //adding the avatars to the form data
    this.addform.patchValue(
      { avatar: files }
    )
  }

  //Delete

  delete(id,$event) {
    $event.preventDefault()
    // @ts:ignore
    let lookup = this.advertisments.findIndex((ad) => ad._id === id);
    this.advertisments.splice(lookup,1)

    this.service.post(API_TYPE.ADMIN,`ads/${id}`,'').subscribe((res)=>{
      this.snackBar.open('Advertisment deleted successfully', 'Ok')

    }, error => {
      console.log(error);
      this.snackBar.open('Advertisment Not found', 'Ok')

    })

    //reseting form
    //this.isActive = false;
   // this.getAllAdds();

  }


 async showDetail(adevert){
  await this.requestImages2(adevert) .then(async ()=>{
    this.advertisment=  adevert
    console.log("ia mhere",  this.addImage)
  })
  }

  back(){
    this.advertisment=  null;
    console.log("back");
  }

  sanitize(downloadedImageBlob: any) {
    return this.sanitizer.bypassSecurityTrustUrl(downloadedImageBlob);
  }
  sanitize2(downloadedImageBlobs: any) {
for(let i = 0; i <downloadedImageBlobs.length ; i ++){
this.advertimage.push(this.sanitizer.bypassSecurityTrustUrl(downloadedImageBlobs[i]))
 }
  }

  requestImages(posts): Observable<any> {

    for (let post of posts) {
      console.log(post.banner[0])
      let queryParam =`?imagename=${post.banner[0]}`;
      let headerOption = { responseType: 'blob' };
      this.service.get(API_TYPE.DEFAULT, 'download', queryParam, headerOption)
        .subscribe(
          (res) => {
            let objectUrl = URL.createObjectURL(res);
            post.downloadedImageBlob = objectUrl;
          },
          (error => post.downloadedImageBlob = 'assets/img/placeholder.png')
        )
    }
    this.advertisments = posts
    console.log(posts);
    return of(posts)
  }

  async requestImages2(postsdetail) {

    for (let image of postsdetail.banner) {
      let queryParam = `?imagename=${image}`;
      let headerOption = { responseType: 'blob' };
      this.service.get(API_TYPE.DEFAULT, 'download', queryParam, headerOption)
        .subscribe(
          (res) => {
            let objectUrl = URL.createObjectURL(res);
            this.addImage.push(objectUrl);
          },
          (error => this.addImage.push('assets/img/placeholder.png')),()=>{
            this.sanitize2(this.addImage);
          }
        )
    }

  }

  maxAge(max: FormControl): { [s: string]: boolean } {
    if (this.addform) {
      let min = this.addform.get('min');
      let control = this.addform.get('max');

      if (control != null)
        if (control.value > 110)
          return { invalidMaxAge: true };


      if (control != null && min != null) {
        if (control.value < min.value) {
          min.setErrors({ invalidMinAge: true })
          return { invalidMaxAge: true };
        }
      }
      min.setErrors(null)

      return null;

    }

  }

  minAge(min: FormControl): { [s: string]: boolean } {
    if (this.addform) {
      let max = this.addform.get('max');
      let control = this.addform.get('min');


      if (control != null && max != null) {
        if (control.value > max.value) {
          max.setErrors({ invalidMaxAge: true })
          return { invalidMinAge: true };
        }
      }
      if (max.value < 120)
        max.setErrors(null)

      return null;

    }

  }
  getNumber(){

    if(this.advertisments)
    this.advertisments.length;
  }
}
