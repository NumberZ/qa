import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';

import { Question } from '../define/question';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ QuestionService ]
})
export class HomeComponent implements OnInit {

  constructor(
    private question: QuestionService
  ) { }

  questions: Question[];

  ngOnInit() {
    this.questions = [
      { content: '台湾的生活和大陆有差异吗？特别需要注意什么？'},
      { content: '如何变的更帅阿？'},
      { content: '如何让人感觉你比较容易交往？'}
    ]
  }

}
