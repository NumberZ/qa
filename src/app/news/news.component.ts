import { Component, OnInit } from '@angular/core';
import { StatusService } from '../status.service';

import Util from '../util';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
  providers: [ StatusService ]
})
export class NewsComponent implements OnInit {

  constructor(
    private statusService: StatusService
  ) { }
  query: string;
  news = [];

  ngOnInit() {
    const queryObject : any = Util.getQueryObject(location.href);
    this.query = queryObject.for;
    this.getNews();

  }

  getNews() {
    if (this.query == 'public') {
      this.getPublicNews();
    } else if (this.query === 'private') {
      this.getPrivateNews();
    }
  }

  getPublicNews() {
    this.statusService.inboxQuery()
      .then((res) => {
        this.news = res;
      })
      .catch(error => {
        console.error(error);
      })
  }

  getPrivateNews() {
    this.statusService.inboxPrivateQuery()
      .then((res) => {
        this.news = res;
      })
      .catch(error => {
        console.error(error);
      })
  }
}
