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
  
  followees = [];
  followers = [];

  ngOnInit() {
    this.getUserList();
  }

  getUserList() {
    const queryObject : any = Util.getQueryObject(location.href);
    if (queryObject.for == 'followee') {
      this.getFolloweeList();
    } else if (queryObject.for === 'follower') {
      this.getFollowerList();
    }
  }

  //
  getFolloweeList() {
    this.userService.getFollowee()
      .then((res) => {
        this.followees = res;
      })
      .catch(error => {
        console.error(error);
      });
  }

  getFollowerList() {
    this.userService.getFollower()
      .then((res) => {
        this.followers = res;
      })
      .catch(error => {
        console.error(error);
      });
  }
}
