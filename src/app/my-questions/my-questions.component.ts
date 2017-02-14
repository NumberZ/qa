import { Component, OnInit } from '@angular/core';
import { QuestionService } from '../question.service';

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

  ngOnInit() {
    this.getQuestions();
    setTimeout(() => {

    }, 300)
  }

  getQuestions() {
    this.questionService.getQuestionsByUser()
      .then(questions => this.questions = questions)
      .catch((error) => {
        console.error(error);
      })
  }

}
