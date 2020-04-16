import { config } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { async } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from 'src/app/service/config/config-service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-advert',
  templateUrl: './advert.component.html',
  styleUrls: ['./advert.component.css']
})
export class AdvertComponent implements OnInit {

  limt: number = 5;
  skip: number = 0;
  isActive = false;
  addform: FormGroup
  queryParam: string = `?limit=${this.limt}&skip=${this.skip}`;
  private imageUrl: Array<any> = [];
  advertisments: Object;

  constructor(private snackBar:MatSnackBar,private config: ConfigService, private service: ProviderService, private formBuilder: FormBuilder, private http: HttpClient) {
    this.addform = this.formBuilder.group({
      title: [''],
      content: [''],
      link: [''],
      owner: [''],
      min: [''],
      max: [''],
      avatar: [null]
    });
  }
  ngOnInit() {
    this.getAllAdds();
  }

  getAllAdds() {
    //retiriving allads
    this.isActive = !this.isActive;
    console.log(this.isActive)
    this.service.get(API_TYPE.ADMIN, 'ads', this.queryParam).subscribe((res) => {
      this.advertisments= res;
      console.log(res);

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
      this.snackBar.open('Advertisment created successfully','Ok')

    }, error => {
      console.log(error);
      this.snackBar.open('Unable to create advertismnet','Ok')

    })

    //reseting form
    this.addform.reset()
    //displaying advertisment list
    this.isActive = !this.isActive;
    //updating adds
    this.getAllAdds();


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
}
