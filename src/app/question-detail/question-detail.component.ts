import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss']
})
export class QuestionDetailComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  question = {
    username: '李林昊',
    content: '台湾的生活跟大陆有什么大的差异吗？特别需要注意什么？',
    time: '9天前',

  }
}
