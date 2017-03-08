import { Injectable } from '@angular/core';
import * as AV from 'leancloud-storage';

import { SignInfo } from './define/signInfo';
import { LoginInfo } from './define/loginInfo';

@Injectable()
export class UserService {

  constructor() {
    
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }
  user = {
    userId: '',
    username: ''
  }

  setUser(id: string, name: string): void {
    this.user.userId = id;
    this.user.username = name;
  }

  //注册
  sign(signInfo: SignInfo){
    const user = new AV.User();
    user.setUsername(signInfo.username);
    user.setPassword(signInfo.password);
    user.setEmail(signInfo.email);
    user.set('introduction', signInfo.introduction);
    return Promise.resolve(user.signUp())
  }

  //登录
  login(loginInfo: LoginInfo): Promise<Object> {
    const username = loginInfo.username;
    const password = loginInfo.password;
    return Promise.resolve(AV.User.logIn(username, password))
  }

  //上传头像
  uploadAvatar(file) {
    const currentUser = AV.User.current();
    const avFile = new AV.File(file.name, file);
    currentUser.set('avatar', avFile);
    return Promise.resolve(currentUser.save())
      .then((res) => {
        console.log(res);
      })
      .catch(this.handleError)
  }
  //登出
  logOut() {
    AV.User.logOut();
  }

  //搜索用户
  searchUser(searchKey) {
    const query = new AV.Query('_User');
    query.equalTo('username', searchKey);
    return Promise.resolve(query.find())
      .then((res: any) => {
        return res.map((ele) => {
          const id = ele.id;
          const avatar = ele.attributes.avatar ? ele.attributes.avatar.attributes.url : '';
          return Object.assign({}, {id}, ele.attributes, {avatar})
        });
      })
      .catch(this.handleError)
  }

  //关注用户
  followUser(id) {
    const currentUser: any = AV.User.current();
    return Promise.resolve(currentUser.follow(id))
      .then((res) => {
        console.log(res);
      })
      .catch(this.handleError)
  }
  
  //取关用户
  unfollowUser(id) {
    const currentUser: any = AV.User.current();
    return Promise.resolve(currentUser.unfollow(id))
      .then((res) => {
        console.log(res);
      })
      .catch(this.handleError)
  }

  //获取用户的关注状态
  getFollowState(id) {
    const currentUser: any = AV.User.current();
    const query = currentUser.followeeQuery();
    return Promise.resolve(query.find())
      .then((res) => {
        const ids = res.map((ele) => ele.id);
        if (ids.indexOf(id) != -1) {
          return true; 
        } else {
          return false;
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  //获取关注用户
  getFollowee() {
    const currentUser: any = AV.User.current();
    const query = currentUser.followeeQuery();
    query.include('followee');
    return Promise.resolve(query.find())
      .then((res) => {
        return res.map((ele: any) => {
          console.log(ele);
          const id = ele.id;
          return Object.assign({}, {id}, ele.attributes)
        })
      })
      .catch(this.handleError);
  }


  //获取粉丝
  getFollower() {
    const currentUser: any = AV.User.current();
    const query = currentUser.followerQuery();
    query.include('follower');
    return Promise.resolve(query.find())
      .then((res) => {
        return res.map((ele: any) => {
          console.log(ele);
          const id = ele.id;
          return Object.assign({}, {id}, ele.attributes)
        })
      })
      .catch(this.handleError);
  }
}

