import { Injectable } from '@angular/core';
import { UserService } from './user.service';

import * as AV from 'leancloud-storage';

@Injectable()
export class QuestionService {

  constructor(
    private userService: UserService
  ) { }
  
  Question = AV.Object.extend('Question');
  
  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  //发布问题
  issueQuestion(questionContent: string) {
    const currentUser = AV.User.current();
    const question = new this.Question();
    question.set('content', questionContent);
    question.set('owner', currentUser);
    return question.save();
  }

  //获得问题
  getQuestions() {
    console.log(new Date().getTime());
    const query = new AV.Query('Question');
    query.include('owner');
    return query.find()
      .then((response: any) => {
          return response.map(ele => {
            console.log(ele);
            return Object.assign({}, {id: ele.id} , ele.attributes, {owner: ele.attributes.owner.attributes})
          });
        }
      )
      .catch(this.handleError);

  }
}
