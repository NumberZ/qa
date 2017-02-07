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

  questions = []
  title = 'old'

  ngOnInit(): void {
    this.getQuestions();
  }

  getQuestions(): void {
    this.questionService.getQuestions()
      .then(questions => this.questions = questions)
      .catch((error) => {
        console.error(error);
      });

    setTimeout(() => {
      this.title = 'new';
    }, 2000)
  }
}
