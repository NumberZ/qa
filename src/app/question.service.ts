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
  issueQuestion(questionContent: string, toId?: string) {
    const currentUser = AV.User.current();
    const question = new this.Question();
    question.set('content', questionContent);
    question.set('owner', currentUser);
    question.set('lastAnswer', '');
    question.set('isAnswered', 0);
    question.set('views', 0);
    if (toId) {
      const query = new AV.Query('_User');
      return Promise.resolve(query.get(toId))
        .then((res) => {
          question.set('to', res);
          return question.save();
        })
    } else {
      return question.save();
    }
  }

  //获得问题
  getQuestions() {
    const query = new AV.Query('Question');
    query.include('owner');
    query.descending('createdAt');
    return Promise.resolve(query.find())
      .then((res: any) => {
          return res.map(ele => {
            const dateFromNow = Util.fromNow(ele.createdAt);
            let lastAnswer = ele.attributes.lastAnswer;
            if (!lastAnswer) {
              lastAnswer = ''
            } else {
              lastAnswer = JSON.parse(lastAnswer);
            }
            return Object.assign({}, {id: ele.id} , ele.attributes, {lastAnswer}, {owner: ele.attributes.owner.attributes}, {dateFromNow})
          });
        }
      )
      .catch(this.handleError);

  }

  getQuestion(id: string) {
    const query = new AV.Query('Question');
    query.include('owner');
    query.include('to');
    return Promise.resolve(query.get(id))
      .then((res: any) => {
        console.log(res);
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
  // 获得受邀问答的问题列表
  getQuestionsByPrivate() {
    const query = new AV.Query('Question');
    const currentUser = AV.User.current();
    query.equalTo('to', currentUser);
    query.equalTo('isAnswered', 0);
    query.include('owner');

    return Promise.resolve(query.find())
      .then((res: any) => {
        console.log(res);
          return res.map(ele => {
            const dateFromNow = Util.fromNow(ele.createdAt);
            return Object.assign({}, {id: ele.id} , ele.attributes, {owner: ele.attributes.owner.attributes}, {to: ele.attributes.to.attributes}, {dateFromNow})
          });
      })
      .catch((error) => {
        this.handleError(error);
      })
      
  }
  // 返回受邀问答的数量
  getNumberOfPri() {
    const query = new AV.Query('Question');
    const currentUser = AV.User.current();
    query.equalTo('to', currentUser);
    query.equalTo('isAnswered', 0);
    return Promise.resolve(query.count())
      .then(res => res)
      .catch((error) => {
        this.handleError(error);
      })
  }
  // 增加浏览次数
  increaseView(id) {
    const query = new AV.Query('Question');
    return Promise.resolve(query.get(id))
      .then((res: any) => {
        res.increment('views', 1);
        return res.save();
      })
      .catch((error) => {
        this.handleError(error);
      })
  }
}
