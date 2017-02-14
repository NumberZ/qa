import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent implements OnInit {

  constructor() { }

  content: string = '';
  isHidden: boolean = true;

  isSuccess: boolean = true;
  isFail: boolean = false;

  ngOnInit() {
  }

  showSuccess(content) {
    this.content = content;
    this.isHidden = false;
    setTimeout(() => {
      this.hide();
    }, 1200);
  }

  showFail(content) {
    this.content = content;
    this.isHidden = false;
    this.isSuccess = false;
    this.isFail = true;
    setTimeout(() => {
      this.hide();
    }, 1200);
  }
  hide() {
    this.isHidden = true;
  }
}
