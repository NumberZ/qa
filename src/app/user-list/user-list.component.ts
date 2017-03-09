import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';

import Util from '../util';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {

  constructor(
    private userService: UserService
  ) { }
  
  loading: boolean = true;
  followees = [];
  followers = [];
  query = '';

  ngOnInit() {
    const queryObject : any = Util.getQueryObject(location.href);
    this.query = queryObject.for;
    this.getUserList();
  }

  getUserList() {
    if (this.query == 'followee') {
      this.getFolloweeList();
    } else if (this.query === 'follower') {
      this.getFollowerList();
    }
  }

  //获取关注列表
  getFolloweeList() {
    this.userService.getFollowee()
      .then((res) => {
        this.loading = false;
        this.followees = res;
      })
      .catch(error => {
        console.error(error);
      });
  }

  //获取粉丝列表
  getFollowerList() {
    this.userService.getFollower()
      .then((res) => {
        this.loading = false;
        this.followers = res;
      })
      .catch(error => {
        console.error(error);
      });
  }

  //取消关注
  unfollow(id) {
    this.userService.unfollowUser(id)
      .then((res) => {
        this.getFolloweeList();
      })
      .catch(error => {
        console.error(error);
      })
  }
}
