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
  
  ngOnInit() {
    const currentUse = AV.User.current();
    if (currentUse) {
      console.log(currentUse);
      this.name = currentUse.attributes.username;
      this.id = currentUse.id;
    } else {
      this.router.navigateByUrl('/login');
    }
  }

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