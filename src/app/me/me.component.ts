import { Component, OnInit, Optional } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';

import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { QuestionService } from '../question.service';

import * as AV from 'leancloud-storage';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  constructor(
    private userService: UserService,

    private router: Router,
    private _dialog: MdDialog,
    private _snackbar: MdSnackBar
  ) { }

  name: string
  id: string
  avatarFile: any;
  avatarUrl: string;

  hiddenAvatarBtn = true;

  ngOnInit() {
    const currentUse = AV.User.current();
    if (currentUse) {
      console.log(currentUse);
      this.name = currentUse.attributes.username;
      this.id = currentUse.id;
      this.avatarUrl = currentUse.attributes.avatar.attributes.url
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
      this._snackbar.open('发布成功', '', {
        duration: 1000
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
      console.log(res);
      this.hiddenAvatarBtn = true;
    })
    .catch((error) => {
      console.error(error);
    })
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