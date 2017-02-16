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
    .then((res) => res.text())
    .catch((error) => {
      console.error(error);
    })
  }

  issueAnswer(questionId, url) {
    const currentUser = AV.User.current();
    const answer = new this.Answer();
    answer.set('owner', currentUser);
    const question = AV.Object.createWithoutData('Question', questionId);
    answer.set('question', question);
    answer.set('url', url);
    return Promise.resolve(answer.save());
  }
}

