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

  questions: Question[];
  title = 'ss'

  ngOnInit(): void {
    this.getQuestion();
  }

  getQuestion(): void {
    this.questionService.getQuestions()
    .then(questions => {
      this.questions = questions;
      this.title = 'hhhhh';
      console.log('biana');
    });
  }

  goDetail(): void {
  
  }

}
