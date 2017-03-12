import { Injectable } from '@angular/core';
import * as AV from 'leancloud-storage';
import Util from './util';

@Injectable()
export class StatusService {

  constructor() { }

  //发布问题状态
  issueQuestionStatus(question) {
    const av: any = AV;
    const id = question.id,
          content = question.attributes.content,
          ownerAvatar = question.attributes.owner.attributes.avatar.attributes.url,
          username = question.attributes.owner.attributes.username;
    const status = new av.Status(question.id , `${username}提问了一个问题`);
    status.set('content', content);
    status.set('avatar', {url: ownerAvatar});
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
    const av: any = AV,
          currentUser = AV.User.current(),
          content = question.content,
          username = currentUser.attributes.username,
          ownerAvatar = currentUser.attributes.avatar.attributes.url;
    const status = new av.Status(question.id , `${username}回答了${question.name}的问题`);
    status.set('content', content);
    status.set('avatar', {url: ownerAvatar});
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
        return res.map(ele => {
          const dateFromNow = Util.fromNow(ele.createdAt);
          return Object.assign({}, {dateFromNow}, ele)
        })
      })
      .catch(error => {
        console.error(error);
      })
  } 
}
