import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { LoginInfo } from '../define/loginInfo';
import { LoginedUser } from '../define/loginedUser';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  loginInfo = new LoginInfo('', '');

  ngOnInit() {
  }

  onSubmit(): void {
    this.userService.login(this.loginInfo)
    .then((loginedUser: any) => {
      this.router.navigateByUrl('/me');
    }, (error) => {
      console.error(error);
    })
  }
}
