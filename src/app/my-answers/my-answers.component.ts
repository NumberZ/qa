import { Component, OnInit } from '@angular/core';

import { AnswerService } from '../answer.service';

@Component({
  selector: 'app-my-answers',
  templateUrl: './my-answers.component.html',
  styleUrls: ['./my-answers.component.scss'],
  providers: [ AnswerService ]
})
export class MyAnswersComponent implements OnInit {

  constructor(
    private answerService: AnswerService,
  ) { }
  answerLoading: boolean = true;
  answers = [];

  ngOnInit() {
    this.getMyAnswers();
  }

  getMyAnswers() {
    this.answerLoading = true;
    this.answerService.getMyAnswers()
      .then(answers => {
        this.answers = answers;
        this.answerLoading = false;
      });
  }

  playVoice(id) {
    const audioEle : any = document.getElementById(id);
    if (audioEle.paused) {
      audioEle.play();
      return ;
    }
    audioEle.pause();
  }
}
