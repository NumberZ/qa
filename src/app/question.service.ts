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
    question.set('favorites', 0);
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
  getQuestions(sort, page) {
    const query = new AV.Query('Question');
    query.limit(10);
    query.skip(page * 10);
    query.include('owner');
    console.log(page);
    switch (sort) {
      case '1':
        query.descending('createdAt');
        break;
      case '2':
        query.descending('views');
        break;
      case '3':
        query.descending('favorites');
        break;
      default:
        query.descending('createdAt');
        break;
    }

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

  //
  favorite(id) {
    const query = new AV.Query('Question');
    const currentUser = AV.User.current();
    return Promise.resolve(query.get(id))
      .then((res: any) => {
        res.increment('favorites', 1);
        let relation = res.relation('favoriteUsers');
        relation.add(currentUser);
        return res.save();
      })
      .catch((error) => {
        this.handleError(error);
      })
  }

  cancleFavorite(id) {
    const query = new AV.Query('Question');
    const currentUser = AV.User.current();
    return Promise.resolve(query.get(id))
      .then((res: any) => {
        res.increment('favorites', -1);
        let relation = res.relation('favoriteUsers');
        relation.remove(currentUser);
        return res.save();
      })
      .catch((error) => {
        this.handleError(error);
      })
  } 

  getFavoriteState(id) {
    const question = AV.Object.createWithoutData('Question', id);
    const relation = question.relation('favoriteUsers');
    const query = relation.query();

    return Promise.resolve(query.find())
      .then((users: any)=> {
       const ids = users.map(ele => ele.id);
       const currentUser = AV.User.current();
       if (ids.includes(currentUser.id)) {
         return true;
       } else {
         return false;
       }
     })
     .catch(error => {
       this.handleError(error);
     })
  }

  searchQuestion(searchKey) {
    const query = new AV.Query('Question');
    query.contains('content', searchKey);
    query.include('owner');
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
}
