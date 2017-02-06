import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '../user.service';
import { SignInfo } from '../define/signInfo';
import { LoginedUser } from '../define/loginedUser';

@Component({
  moduleId: module.id,
  selector: 'app-sign',
  templateUrl: './sign.component.html',
  styleUrls: ['./sign.component.scss'],
})
export class SignComponent implements OnInit {
  constructor(
    private userService: UserService,
    private router: Router
  ) { }

  signInfo = new SignInfo('', '');

  get diagnostic() { return JSON.stringify(this.signInfo); }

  ngOnInit() {
    
  }

  onSubmit(): void {
    this.userService.sign(this.signInfo)
      .then((loginedUser: LoginedUser) => {
        this.router.navigateByUrl('/login');
      }, (error) => {
        console.error(error);
      })
  }


}
