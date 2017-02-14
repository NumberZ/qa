import { Injectable } from '@angular/core';
import { UserService } from './user.service';

import * as AV from 'leancloud-storage';

import Util from './util';

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
    const query = new AV.Query('Question');
    query.include('owner');
    console.log(typeof query.find().then)
    return Promise.resolve(query.find())
      .then((res: any) => {
          return res.map(ele => {
            const dateFromNow = Util.fromNow(ele.createdAt);
            return Object.assign({}, {id: ele.id} , ele.attributes, {owner: ele.attributes.owner.attributes}, {dateFromNow})
          });
        }
      )
      .catch(this.handleError);

  }

  getQuestion(id: string) {
    const query = new AV.Query('Question');
    query.include('owner');
    return Promise.resolve(query.get(id))
      .then((res: any) => {
        const dateFromNow = Util.fromNow(res.createdAt);
        return Object.assign({}, {id: res.id}, res.attributes, {owner: res.attributes.owner.attributes},  {dateFromNow})
      })  
      .catch(this.handleError);
  }

  getQuestionsByUser() {
    const query = new AV.Query('Question');
    const currentUser = AV.User.current();
    query.equalTo('owner', currentUser);
    query.include('owner');

    return Promise.resolve(query.find())
      .then((res: any) => {
          return res.map(ele => {
            const dateFromNow = Util.fromNow(ele.createdAt);
            return Object.assign({}, {id: ele.id} , ele.attributes, {owner: ele.attributes.owner.attributes}, {dateFromNow})
          });
      })
      .catch((error) => {
        this.handleError(error);
      })

  }
}
