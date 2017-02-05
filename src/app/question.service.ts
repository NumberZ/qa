import { Injectable } from '@angular/core';
import { UserService } from './user.service';

import * as AV from 'leancloud-storage';

@Injectable()
export class QuestionService {

  constructor(
    private userService: UserService
  ) { }
  
  Question = AV.Object.extend('Question');

  issueQuestion(questionContent: string) {
    const currentUser = AV.User.current();
    const question = new this.Question();
    question.set('content', questionContent);
    question.set('owner', currentUser);
    return question.save();
  }
}
