import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SignComponent } from './sign/sign.component';
import { HomeComponent } from './home/home.component';
import { MeComponent } from './me/me.component';
import { QuestionDetailComponent } from './question-detail/question-detail.component';
import { SearchComponent } from './search/search.component';

import { MyQuestionsComponent } from './my-questions/my-questions.component';
import { MyAnswersComponent } from './my-answers/my-answers.component';

import { UserListComponent } from './user-list/user-list.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full'},
  { path: 'home', component: HomeComponent },
  { path: 'me', component: MeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'sign', component: SignComponent },
  { path: 'question/:id', component: QuestionDetailComponent },
  { path: 'myQuestions', component: MyQuestionsComponent },
  { path: 'myAnswers', component: MyAnswersComponent },
  { path: 'search', component: SearchComponent },
  { path: 'userlist', component: UserListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
