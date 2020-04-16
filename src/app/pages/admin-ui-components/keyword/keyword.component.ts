import { ProviderService } from 'src/app/service/provider-service/provider.service';
import { Component, OnInit } from '@angular/core';
import { API_TYPE } from 'src/app/model/apiType';

@Component({
  selector: 'app-keyword',
  templateUrl: './keyword.component.html',
  styleUrls: ['./keyword.component.css']
})
export class KeywordComponent implements OnInit {
  constructor(private providerService: ProviderService) { }
  bannedWords: [];
  ngOnInit() {
    this.loadWords();
  }
  loadWords() {
    this.providerService.get(API_TYPE.ADMIN, 'blacklistwords', '')
      .subscribe((words: []) => {
        this.bannedWords = words;
      });
  }
  addWord(word: HTMLInputElement) {
    let sentWord = [word.value];
    this.providerService.post(API_TYPE.ADMIN, 'blacklistwords', sentWord)
      .subscribe(() => {
        this.loadWords();
      });

  }
  deleteWord(wordId) {
    this.providerService.delete(API_TYPE.ADMIN, `blacklistwords/${wordId}`, '')
      .subscribe(() => {
        this.loadWords();
      });
  }

}
