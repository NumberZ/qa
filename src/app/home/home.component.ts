import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as AV from 'leancloud-storage';

import { QuestionService } from '../question.service';
import { Question } from '../define/question';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [ QuestionService ]
})
export class HomeComponent implements OnInit {
  constructor(
    private questionService: QuestionService,
    private router: Router
  ) { }

  questions = [];
  firstLoading = false;
  loading: boolean = true;
  sort = '1';
  $element = document.querySelector('#container');
  $domDown = document.querySelector('.dropload-down');
  $domUp = document.querySelector('.dropload-up');
  page = 0;

  _startY;
  _curY;
  _moveY;
  _touchScrollTop;
  _threshold = Math.floor(50 * 2 /3);
  _direction;
  _distance = 50;
  _offsetY;
  _scrollTop;
  
  _scrollContentHeight;
  _scrollWindowHeight = document.documentElement.clientHeight;

  upInsertDOM;
  domUpHeight;
  domUpState;
  domDownState;
  domUpStyles;

  ngOnInit(): void {
    this.getQuestions(this.page);
    window.addEventListener('scroll', () => {
      this._scrollContentHeight = document.documentElement.scrollHeight;
      this._scrollTop = window.scrollY;
      if (!this.loading && this._scrollContentHeight - this._threshold <= this._scrollWindowHeight + this._scrollTop) {
        this._direction = 'up';
        this.domDownState = 'load';
        this.loading = true;
        this.page++;
        this.getQuestions(this.page);
      } 
    })
  }

  ngOnDestroy() {
    window.removeEventListener('scroll');
  }
  getQuestions(page, reset = false): void {
    this.loading = true;
    console.time('getQuestions');
    this.questionService.getQuestions(this.sort, page)
      .then((questions: any) => {
        this.firstLoading = false;
        this.loading = false;
        this.domUpStyles = Object.assign({}, this.domUpStyles, {
          'height': '0',
        });
        if (reset) {
          this.questions = questions;
        } else {
          this.questions = this.questions.concat(questions);
        }
        if (questions.length === 0) {
          this.domDownState = 'noData';
          this.page --;
        } else {
          this.domDownState = 'refresh';
        }
        console.timeEnd('getQuestions');
      })
      .catch((error) => {
        console.error(error);
      });
  }

  playVoice($event, id) {
    // $event.stopPropagation();
    const audioEle : any = document.getElementById(id);
    if (audioEle.paused) {
      audioEle.play();
      return ;
    }
    audioEle.pause();
  }

  changeSort() {
    this.page = 0;
    this.getQuestions(this.page, true);
  }

  get watch() {
    return JSON.stringify({
    '_startY': this._startY,
    '_curY': this._curY,
    '_offsetY': this._offsetY,
    '_moveY': this._moveY,
    '_touchScrollTop': this._touchScrollTop,
    '_threshold': this._threshold,
    '_direction': this._direction,
    '_scrollWindowHeight': this._scrollWindowHeight,
    '_scrollContentHeight': this._scrollContentHeight,
    '_scrollTop': this._scrollTop
    })
  }

  beginTouch($event) {
    if (!this.loading) {
      this._startY = $event.touches[0].pageY;
      this._touchScrollTop = window.scrollY;
    }

  }

  moveTouch($event) {
    if (!this.loading) {
      this._curY = $event.touches[0].pageY;
      this._moveY = this._curY - this._startY;
      if (this._moveY > 0) {
        this._direction = 'down';
      } else if (this._moveY < 0) {
        this._direction = 'up';
      }
      let _absMoveY = Math.abs(this._moveY);
      if (this._touchScrollTop <= 0 && this._direction === 'down') {
        if (_absMoveY < this._distance) {
          this._offsetY = _absMoveY;
          this.domUpState = 'refresh';
        } else if (_absMoveY > this._distance && _absMoveY <= this._distance * 2) {
          this._offsetY = this._distance + (_absMoveY - this._distance) * 0.5;
          this.domUpState = 'update';
        } else {
          this._offsetY = this._distance + this._distance * 0.5 + (_absMoveY - this._distance * 2) * 0.2;
        }
          this.domUpStyles = {
            'height': this._offsetY + 'px'
          }
      }
    }
  }

  endTouch($event) {
    let _absMoveY = Math.abs(this._moveY);
    if (this._touchScrollTop <= 0 && this._direction === 'down') {
      this.domUpStyles = Object.assign({}, this.domUpStyles, {
        'transition': 'all 300ms',
        '-webkit-transition': 'all 300ms'
      });
      if (_absMoveY > this._distance) {
        this.domUpStyles = Object.assign({}, this.domUpStyles, {
          'height': '50px',
        });
        this.domUpState = 'load';
        this.page = 0;
        this.getQuestions(this.page, true);
      } else {
        this.domUpStyles = Object.assign({}, this.domUpStyles, {
          'height': '0px',
        });
      }
      this._moveY = 0;
    }
  }
}
