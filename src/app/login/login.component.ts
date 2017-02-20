import { Component, OnInit, ViewChild} from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { LoginInfo } from '../define/loginInfo';
import { LoginedUser } from '../define/loginedUser';
import { AlertComponent } from '../alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @ViewChild(AlertComponent) alert: AlertComponent;

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
    })
    .catch(error => {
      this.alert.showFail(error.message);
    })
  }
}
