import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import * as AV from 'leancloud-storage';

@Component({
  selector: 'app-me',
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router
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
    this.userService.logOut();
  }

}
