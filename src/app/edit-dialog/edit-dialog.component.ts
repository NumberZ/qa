import { Component, OnInit, Optional} from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { QuestionService } from '../question.service';

@Component({
 templateUrl: './edit-dialog.component.html',
 styleUrls: ['./edit-dialog.component.scss'],
})
export class EditDialog {
  constructor(
    @Optional() public dialogRef: MdDialogRef<EditDialog>,
    ) { }
  question: string = '';

  onSubmit() {
    this.dialogRef.close(this.question);
  }
}