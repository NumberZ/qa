import { Injectable } from '@angular/core';
import * as AV from 'leancloud-storage';

import { SignInfo } from './define/signInfo';
import { LoginInfo } from './define/loginInfo';

@Injectable()
export class UserService {
  
  constructor() {
    
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
  sign(signInfo: SignInfo): Promise<Object> {
    const user = new AV.User();
    user.setUsername(signInfo.username);
    user.setPassword(signInfo.password);
    return user.signUp()
  }

  //登录
  login(loginInfo: LoginInfo): Promise<Object> {
    const username = loginInfo.username;
    const password = loginInfo.password;
    return AV.User.logIn(username, password)
  }

  //登出
  logOut() {
    AV.User.logOut();
  }
}

