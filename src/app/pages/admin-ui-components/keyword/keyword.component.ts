import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { Component, OnInit } from '@angular/core';
import { API_TYPE } from 'src/app/model/apiType';
import {MatSnackBar} from "@angular/material/snack-bar";
import {NgModel} from "@angular/forms";


export interface Words {
  _id: string;
  word: string;
}

@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.css']
})
export class KeywordComponent implements OnInit {
  constructor(private providerService: ProviderService,private snackbar : MatSnackBar) { }
  bannedWords: Array<Words> = [];
  ngOnInit() {
    this.loadWords();
  }
  loadWords() {
    this.providerService.get(API_TYPE.ADMIN, 'blacklistwords', '')
      .subscribe((words: Array<Words>) => {
        this.bannedWords = words;
      });
  }

  addWord(word: NgModel) {
    // @ts-ignore
    let lookup = this.bannedWords.find((bannedWord) => bannedWord.word.toLowerCase() == word.value)

    if(!lookup){
   // @ts-ignore
    this.bannedWords.push({_id: '',word: word.value})
      let sentWord = [word.value];
      this.providerService.post(API_TYPE.ADMIN, 'blacklistwords', sentWord)
        .subscribe(
          () => {
            this.snackbar.open(`Keyword Configured`,'OK',{duration: 3000})
            },
          () => {
            this.snackbar.open(`Unable to configure keyword. Please try again`,'OK',{duration: 3000})
            this.bannedWords.pop()
          }
        );
    }else{
       this.snackbar.open('Keyword Already exist','OK', {duration: 3000})
    }


  }
  deleteWord(wordId) {
    console.log(`ID: ${wordId}`)
    let lookup = this.bannedWords.findIndex((word) => word._id === wordId)
    // remove from array
    this.bannedWords.splice(lookup,1)

    this.providerService.delete(API_TYPE.ADMIN, `blacklistwords/${wordId}`, '')
      .subscribe(
        () => {
        this.snackbar.open(`Keyword Removed`,'Ok',{duration: 3000})
        },
        (error => {
          this.snackbar.open(`Unable to perform request`,'OK', {duration: 3000})
        })
      );
  }

}
