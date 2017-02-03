import { Component, OnInit } from '@angular/core';
import * as AV from 'leancloud-storage';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'hah';
  ngOnInit() {
    const appId = '2etjAxh2GjbdH3JypDam9XOg-gzGzoHsz';
    const appKey = 'CIyqyfBsdQ9lT1KrDpa4OvY3';
    AV.init({ appId, appKey });
  }
}
