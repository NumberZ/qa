import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import * as AV from 'leancloud-storage';

import Util from './util';

@Injectable()
export class AnswerService {

  constructor(
    private http: Http
  ) { }
  downloadApi = 'http://file.api.weixin.qq.com/cgi-bin/media/get?';
  
  Answer = AV.Object.extend('Answer');
  
  uploadAnswer(serverId) {
    return this.http.get(`api/uploadVoice?serverId=${serverId}`)
    .toPromise()
    .then((res) => res.json())
    .catch((error) => {
      console.error(error);
    })
  }

  issueAnswer(questionId, url, duration) {
    const currentUser = AV.User.current();
    const answer = new this.Answer();
    answer.set('owner', currentUser);
    const question = AV.Object.createWithoutData('Question', questionId);
    answer.set('question', question);
    answer.set('url', url);
    answer.set('duration', duration);
    question.set('lastAnswer', JSON.stringify({
      url,
      duration,
      currentUser
    }))
    return Promise.resolve(answer.save().then(question.save()))
      .then(res => res.json())
      .catch(error => {
        console.error(error);
      })
  }

  getAnswers(questionId) {
    const query = new AV.Query('Answer');
    const question = AV.Object.createWithoutData('Question', questionId);
    query.equalTo('question', question);
    query.include('owner');
    return Promise.resolve(query.find())
      .then((res: any) => {
          console.log(res);
          return res.map(ele => {
            const dateFromNow = Util.fromNow(ele.createdAt);
            return Object.assign({}, {id: ele.id} , ele.attributes, {owner: ele.attributes.owner.attributes}, {dateFromNow})
          });
      })
      .catch(error => {
        console.error(error);
      })
  }

  getMyAnswers() {
    const query = new AV.Query('Answer');
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
      .catch(error => {
      console.error(error);
      })
  }
}

