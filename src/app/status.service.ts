import { Injectable } from '@angular/core';
import * as AV from 'leancloud-storage';

@Injectable()
export class StatusService {

  constructor() { }

  //发布问题状态
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

  //回答消息状态
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

  //查询收件箱
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
