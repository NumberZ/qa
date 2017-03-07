import { Component, OnInit, Optional, ViewChild} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';

import { UserService } from '../user.service';
import { QuestionService } from '../question.service';

import { AlertComponent } from '../alert/alert.component';
import { EditDialog } from '../edit-dialog/edit-dialog.component';

import * as AV from 'leancloud-storage';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
  providers: [QuestionService]
})
export class SearchComponent implements OnInit {
  @ViewChild(AlertComponent) alert: AlertComponent;
  
  searchKey = '';
  loading: boolean = false;
  result;
  isFollowing: boolean;
  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private _dialog: MdDialog
  ) { }

  ngOnInit() {
  }

  clearSearchKey() {
    this.searchKey = '';
  }

  search($event) {
    this.result = null;
    if ($event.keyCode === 13) {
      this.loading = true;
      this.userService.searchUser(this.searchKey)
        .then(res => {
          this.loading = false;
          this.result = res[0];
          this.getFollowState();
          console.log(this.result);
        })
        .catch((error) => {
          console.error(error);
        })
    }
  }
  
  openDialog() {
    let dialogRef = this._dialog.open(EditDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.questionService.issueQuestion(result, this.result.id)
        .then((res) => {
          this.alert.showSuccess('发布成功!');
        })
        .catch(error => {
          console.error(error);
        })
    })
  }

  //关注用户
  follow() {
    this.userService.followUser(this.result.id)
      .then(res => {
        this.isFollowing = true;
      })
      .catch(error => {
        console.error(error);
      })
  }

  //取关用户
  unfollow() {
    this.userService.unfollowUser(this.result.id)
      .then(res => {
        this.isFollowing = false;
      })
      .catch(error => {
        console.error(error);
      });
  }

  //获取关注的状态
  getFollowState() {
    this.userService.getFollowState(this.result.id)
      .then((res) => {
        if (res) {
          this.isFollowing = true;
        } else {
          this.isFollowing = false;
        }
      })
      .catch(error => {
        console.error(error);
      })
  }
}

