/// <reference path="../../typings/index.d.ts" />

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MaterialModule } from '@angular/material';

//路由模块
import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';
import { NavigatorComponent } from './navigator/navigator.component';
import { LoginComponent } from './login/login.component';
import { SignComponent } from './sign/sign.component';
import { HomeComponent } from './home/home.component';

import { UserService } from './user.service';
import { MeComponent, EditDialog } from './me/me.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { MyQuestionsComponent } from './my-questions/my-questions.component';
import { AlertComponent } from './alert/alert.component';
import { LoadingComponent } from './loading/loading.component';

@NgModule({
  declarations: [
    AppComponent,
    NavigatorComponent,
    LoginComponent,
    SignComponent,
    HomeComponent,
    MeComponent,
    EditDialog,
    QuestionDetailComponent,
    MyQuestionsComponent,
    AlertComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    AppRoutingModule,
    MaterialModule.forRoot()
  ],
  entryComponents: [EditDialog],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
