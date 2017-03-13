import { Component, OnInit, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import Util from '../util';

import { AlertComponent } from '../alert/alert.component';
import { EditDialog } from '../edit-dialog/edit-dialog.component';

import { UserService } from '../user.service';
import { QuestionService } from '../question.service';
import { StatusService } from '../status.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  
  providers: [QuestionService, StatusService]
})
export class UserListComponent implements OnInit {
  @ViewChild(AlertComponent) alert: AlertComponent;

  constructor(
    private questionService: QuestionService,
    private statusService: StatusService,    
    private userService: UserService,
    private _dialog: MdDialog
  ) { }
  
  loading: boolean = true;
  followees = [];
  followers = [];
  query = '';
  startPoint;
  endPoint;
  totalNumber: number = 0;

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
        this.totalNumber = res.length;
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
        this.totalNumber = res.length;
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

  triggerStart($event) {
    console.log("start");
    $event.preventDefault();
    $event.stopPropagation();
    this.startPoint = $event.changedTouches[0].pageX;
  }

  triggerEnd($event, id) {
    $event.preventDefault();
    $event.stopPropagation();
    this.endPoint = $event.changedTouches[0].pageX;
    console.log(this.startPoint, this.endPoint);
    const ele = document.getElementById(id);
    if (this.startPoint - this.endPoint > 50) {
      ele.classList.add("active");
    } else if (this.startPoint - this.endPoint < -50) {
      ele.classList.remove("active");
    }
  }


  openDialog() {
    let dialogRef = this._dialog.open(EditDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.questionService.issueQuestion(result)
        .then((res) => {
          this.statusService.issueQuestionStatus(res);
          this.alert.showSuccess('发布成功!');
        }, (error) => {
          alert(JSON.stringify(error));
        });
      })
  }

  sendQuestion(id) {
    let dialogRef = this._dialog.open(EditDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.questionService.issueQuestion(result, id)
        .then((res) => {
          this.statusService.issueQuestionStatus(res);
          this.alert.showSuccess('发布成功!');
        }, (error) => {
          alert(JSON.stringify(error));
        });
      })
  }

  sendPrivate(id) {
    let dialogRef = this._dialog.open(EditDialog);
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.statusService.sendPrivate(result, id)
        .then((res) => {
          this.alert.showSuccess('私信成功!');
        }, (error) => {
          alert(JSON.stringify(error));
        });
      })   
  }
}
