import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';
import Util from '../util';

@Component({
  selector: 'app-my-questions',
  templateUrl: './my-questions.component.html',
  styleUrls: ['./my-questions.component.scss'],
  providers: [ QuestionService ]
})
export class MyQuestionsComponent implements OnInit {

  constructor(
    private questionService: QuestionService
  ) { }

  questions = [];
  loading: boolean = true;
  empty: boolean = false;

  ngOnInit() {
    this.getQuestions();
  }
  
  getQuestions() {
    const queryObject : any = Util.getQueryObject(location.href);
    if (!queryObject) {
      this.questionService.getQuestionsByUser()
        .then((questions) => {
          if (questions.length === 0) {
            this.empty = true;
          }
          this.questions = questions;
          this.loading = false;
        })
        .catch(error => {
          console.error(error);
        })
    } else if(queryObject.private === 'true') {
      this.questionService.getQuestionsByPrivate()
        .then((questions) => {
          if (questions.length === 0) {
            this.empty = true;
          }
          this.questions =  questions;
          this.loading = false;
        })
    }
  }

}
