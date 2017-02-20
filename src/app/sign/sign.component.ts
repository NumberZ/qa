import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { SignInfo } from '../define/signInfo';
import { LoginedUser } from '../define/loginedUser';
import { AlertComponent } from '../alert/alert.component';


@Component({
  moduleId: module.id,
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit {
  @ViewChild(AlertComponent) alert: AlertComponent;

  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  signInfo = new SignInfo('', '', '', '');

  get diagnostic() { return JSON.stringify(this.signInfo); }

  ngOnInit() {
    
  }

  onSubmit(): void {
    this.userService.sign(this.signInfo)
      .then((loginedUser: LoginedUser) => {
        this.router.navigateByUrl('/login');
      })
      .catch((error) => {
        this.alert.showFail(error.message);
      })
  }


}
