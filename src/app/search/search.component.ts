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
}

