import { Component, OnInit, ViewChild } from '@angular/core';
import { WxService } from '../wx.service';
import { QuestionService } from '../question.service';
import { AnswerService } from '../answer.service';

import { AlertComponent } from '../alert/alert.component';
import { ActivatedRoute, Params }   from '@angular/router';

import * as AV from 'leancloud-storage';
import 'rxjs/add/operator/switchMap';

@Component({
  moduleId: module.id,
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
  providers: [WxService, QuestionService, AnswerService]
})
export class QuestionDetailComponent implements OnInit {
  @ViewChild(AlertComponent) alert: AlertComponent;

  start: number;
  end: number;
  recordTimer;
  btnActive: boolean = false;
  voice: any = {};
  answerLoading: boolean = true;
  qId = location.pathname.split('/').pop();
  question = {
    owner: {
      username: ''
    },
    id: '',
    to: null
  }
  answers = [];
  constructor(
    private wxService: WxService,
    private questionService: QuestionService,
    private answerService: AnswerService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    const localUrl = encodeURIComponent(location.href.split('#')[0]);
    this.getQuestion();
    this.getAnswers();
    this.wxService.getSign(localUrl)
    .then((res) => {
      wx.config({
        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
        appId: 'wx039613f59e8ce6c4', // 必填，公众号的唯一标识
        timestamp: res.timestamp, // 必填，生成签名的时间戳
        nonceStr: res.nonceStr, // 必填，生成签名的随机串
        signature: res.signature,// 必填，签名，见附录1
        jsApiList: ['startRecord', 'stopRecord', 'pauseVoice', 'pauseVoice', 'uploadVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
      });
    })
    .catch(error => {
      const errStr = JSON.stringify(error) + '出错了';
      alert(errStr);
    });

    wx.ready(() => {
     
    });

    wx.error((error) => {
      location.reload();
    });
    
  }

  getQuestion() {
    
    console.time('getQuestion');
    this.questionService.getQuestion(this.qId)
      .then(question => {
        console.timeEnd('getQuestion');
        console.log(question);
        this.question = question;
        this.increaseViews();
      });
  }

  getCurrentUserId() {
    const currentUser = AV.User.current();
    return currentUser ? currentUser.id : undefined;
  }

  getAnswers() {
    this.answerLoading = true;
    this.answerService.getAnswers(this.qId)
      .then(answers => {
        this.answers = answers;
        this.answerLoading = false;
      });
  }

  increaseViews() {
    this.questionService.increaseView(this.qId)
      .then((res) => {console.log(res)})
      .catch((error) => console.error(error)
      );
  }

  beginTranscribe($event): void {
    $event.preventDefault();
    if (!this.getCurrentUserId()) {
      this.alert.showFail('请先登录！');
      return ;      
    }    
    if (this.question.to && this.getCurrentUserId() !== this.question.to.id) {
      this.alert.showFail('您无权回答该问题！');
      return ;
    }
    this.btnActive = true;
    this.start = new Date().getTime();
    this.recordTimer = setTimeout(() => {
      wx.startRecord({
        success: () => {
          console.log("开始录音...");
        },
        cancle: () => {
          alert('用户拒绝授权录音');
        }
      });
    }, 300);

  }

  endTranscribe($event): void {
    $event.preventDefault();
    this.btnActive = false;
    this.end = new Date().getTime();
    if ((this.end - this.start < 300)) {
      this.end = 0;
      this.start = 0;
      clearTimeout(this.recordTimer);
    } else {
      wx.stopRecord({
        success: (res) => {
          this.voice.localId = res.localId;
          this.uploadVoice();
        },
        fail: (res) => {
          alert(JSON.stringify(res));
        }
      })
    }
  }

  uploadVoice() {
    wx.uploadVoice({
      localId: this.voice.localId,
      isShowProgressTips: 1,
      success: (res) => {
        this.answerService.uploadAnswer(res.serverId)
          .then((res) => {
            return this.answerService.issueAnswer(this.question.id, res.url, res.duration)
          })
          .then((res) => {
            location.reload();
          })
      },
      fail: (res) => {
        alert(JSON.stringify(res));
      }
    })
  }

  playVoice(id) {
    const audioEle : any = document.getElementById(id);
    if (audioEle.paused) {
      audioEle.play();
      return ;
    }
    audioEle.pause();
  }
}
