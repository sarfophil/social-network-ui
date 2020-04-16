import { Component, OnInit } from '@angular/core';
import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { API_TYPE } from 'src/app/model/apiType';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { async } from '@angular/core/testing';

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
  constructor(private service: ProviderService, private formBuilder: FormBuilder) {
    //   this.addform = this.formBuilder.group({
    //     title:[''],
    //     content:['']new FormControl('content',[Validators.minLength(5),Validators.maxLength(30),Validators.required]),
    //     link:new FormControl(''),
    //     owner:new FormControl(''),
    //       min:new FormControl(''),
    //       max:new FormControl(''),
    //     avatar:new FormControl(null)
    //   });
    //  }

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
    this.isActive = !this.isActive;
    console.log(this.isActive)
    this.service.get(API_TYPE.ADMIN, 'ads', this.queryParam).subscribe((res) => {
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
    

  }


  async uploadFile(event) {
    let files: FileList
    files = (event.target as HTMLInputElement).files;
    
    for (let i = 0; i < files.length; i++) {
      this.imageUrl = [];
      var mimeType = files[i].type;
      if (mimeType.match(/image\/*/) == null) {
        return;
      }
      
      let reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl.push(e.target.result);
      }
      reader.readAsDataURL(files[i]);
    }
    this.addform.patchValue(
      { avatar: files }
    )
  }
}
