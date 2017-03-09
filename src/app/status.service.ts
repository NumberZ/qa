import { Injectable } from '@angular/core';
import * as AV from 'leancloud-storage';

@Injectable()
export class StatusService {

  constructor() { }

  issueQuestionStatus(question) {

    const av: any = AV;
    const id = question.id,
          content = question.attributes.content,
          ownerAvatar = question.attributes.owner.attributes.avatar.attributes.url;
    const status = new av.Status(question.id ,'我提问了一个问题');
    status.set('content', content);
    status.set('avatar', {url: ownerAvatar});
    status.set('type', 'q');
    av.Status.sendStatusToFollowers(status)
      .then((status) => {
        console.dir(status);
      })
      .catch(error => {
        console.dir(error);
      });
  }

  issueAnswerStatus(question) {
    const av: any = AV;
    const id = question.id,
          content = question.attributes.content,
          ownerAvatar = question.attributes.owner.attributes.avatar.attributes.url;
    const status = new av.Status(question.id , '我回答了xxx的问题');
    status.set('content', content);
    status.set('avatar', {url: ownerAvatar});
    status.set('type', 'a');
    av.Status.sendStatusToFollowers(status)
      .then((status) => {
        console.dir(status);
      })
      .catch(error => {
        console.dir(error);
      });
  }

  inboxQuery() {
    const av: any = AV;
    const query = av.Status.inboxQuery(AV.User.current());
    return Promise.resolve(query.find())
      .then((res) => {
        console.log(res);
        return res;
      })
      .catch(error => {
        console.error(error);
      })
  } 
}
