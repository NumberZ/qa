import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AV from 'leancloud-storage';

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
    private questionService: QuestionService,
    private router: Router
  ) { }

  questions = [];
  loading: boolean = true;

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions(): void {
    console.time('getQuestions');
    this.questionService.getQuestions()
      .then((questions: any) => {
        this.questions = questions;
        this.loading = false;
        console.log(this.questions);
            // }, 1000)
    console.timeEnd('getQuestions');
      })
      .catch((error) => {
        console.error(error);
      });

    // setTimeout(() => {
    //   // this.title = 'new';
    //   // console.log(this.questions);

  }
}
