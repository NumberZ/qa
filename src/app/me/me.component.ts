import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { AlertComponent } from '../alert/alert.component';
import { EditDialog } from '../edit-dialog/edit-dialog.component';

import { UserService } from '../user.service';
import { QuestionService } from '../question.service';
import { StatusService } from '../status.service';

import * as AV from 'leancloud-storage';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss'],
  providers: [QuestionService, StatusService]
})
export class MeComponent implements OnInit {
  @ViewChild(AlertComponent) alert: AlertComponent;

  constructor(
    private userService: UserService,
    private questionService: QuestionService,
    private statusService: StatusService,
    private router: Router,
    private _dialog: MdDialog
  ) { }

  name: string;
  id: string;
  introduction: string;
  avatarFile: any;
  avatarUrl: string;
  initAvatarUrl: string;
  email: string;
  hiddenAvatarBtn = true;
  numberOfPri: number;

  ngOnInit() {
    const currentUse = AV.User.current();
    if (currentUse) {
      this.id = currentUse.id;
      this.name = currentUse.attributes.username;
      this.introduction = currentUse.attributes.introduction;
      this.email = currentUse.attributes.email;
      this.avatarUrl = currentUse.attributes.avatar ? currentUse.attributes.avatar .attributes.url : '';
      this.initAvatarUrl = this.avatarUrl;
    } else {
      this.router.navigateByUrl('/login');
    }
    this.getNumberOfPrivate();
    console.log('refresh');
  }
  // 退出登录
  logOut() {
    console.log('logout');
    this.userService.logOut();
    this.router.navigateByUrl('/login');
  }

  resetPassword() {
    Promise.resolve(AV.User.requestPasswordReset(this.email))
      .then((success) => {
        this.alert.showSuccess('重置邮件已发送至您邮箱!');
      },(error) => {
        this.alert.showFail(error.message);
    })
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

  fileChangeEvent(fileInput: any) {
    if(!fileInput) return;
    const file = fileInput.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.avatarUrl = reader.result; 
      this.hiddenAvatarBtn = false;
    }
    this.avatarFile = file;
  }

  uploadAvatar() {
    this.userService.uploadAvatar(this.avatarFile)
    .then((res) => {
      this.hiddenAvatarBtn = true;
    })
    .catch((error) => {
      this.hiddenAvatarBtn = true;
      console.error(error);
    })
  }

  cancleUpload() {
    this.avatarUrl = this.initAvatarUrl;
    this.hiddenAvatarBtn = true;
  }

  getNumberOfPrivate() {
    this.questionService.getNumberOfPri() 
      .then((res: number) => {
        this.numberOfPri = res;
      })
      .catch(error => {
        console.error(error);
      })
  }
}
