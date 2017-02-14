import { Component, OnInit, Optional, ViewChild } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { Router } from '@angular/router';

import { AlertComponent } from '../alert/alert.component';

import { UserService } from '../user.service';
import { QuestionService } from '../question.service';

import * as AV from 'leancloud-storage';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  @ViewChild(AlertComponent) alert: AlertComponent;

  constructor(
    private userService: UserService,

    private router: Router,
    private _dialog: MdDialog
  ) { }

  name: string;
  id: string;
  introduction: string;
  avatarFile: any;
  avatarUrl: string;
  initAvatarUrl: string;
  hiddenAvatarBtn = true;

  ngOnInit() {
    const currentUse = AV.User.current();
    if (currentUse) {
      this.id = currentUse.id;
      this.name = currentUse.attributes.username;
      this.introduction = currentUse.attributes.introduction;
      this.avatarUrl = currentUse.attributes.avatar ? currentUse.attributes.avatar .attributes.url : '';
      this.initAvatarUrl = this.avatarUrl;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  //登出
  logOut() {
    console.log('logout');
    this.userService.logOut();
    this.router.navigateByUrl('/login');
  }

  openDialog() {
    let dialogRef = this._dialog.open(EditDialog);
    
    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.alert.showSuccess('发布成功!');
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
      console.log(res);
      this.hiddenAvatarBtn = true;
    })
    .catch((error) => {
      console.error(error);
    })
  }

  cancleUpload() {
    this.avatarUrl = this.initAvatarUrl;
    this.hiddenAvatarBtn = true;
  }
}

  

@Component({
 templateUrl: './edit-dialog.component.html',
 styleUrls: ['./edit-dialog.component.scss'],
 providers: [QuestionService]
})
export class EditDialog {
  constructor(
    @Optional() public dialogRef: MdDialogRef<EditDialog>,
    private questionService: QuestionService
    ) { }
  question: string = '';

  onSubmit() {
    console.log(this.question);
    this.questionService.issueQuestion(this.question)
    .then((result) => {
      console.log(result);
    }, (error) => {
      alert(JSON.stringify(error));
    });
    this.dialogRef.close(this.question);
  }
}