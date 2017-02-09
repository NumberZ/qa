import { Component, OnInit } from '@angular/core';
import { WxService } from '../wx.service';

@Component({
  selector: 'app-question-detail',
  templateUrl: './question-detail.component.html',
  styleUrls: ['./question-detail.component.scss'],
  providers: [WxService]
})
export class QuestionDetailComponent implements OnInit {
  start: number;
  end: number;
  recordTimer;

  constructor(
    private wxService: WxService
  ) { }

  ngOnInit() {
    // this.wxService.getConfig()
    // .then((config) => {
    //   wx.config(config);
    // })
    // .catch((error) => {
    //   console.error(error);
    // });

    wx.config({
      debug: true, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
      appId: 'wxaf744a29c3c7fb40', // 必填，公众号的唯一标识
      timestamp: 1486564127647, // 必填，生成签名的时间戳
      nonceStr: 'tree', // 必填，生成签名的随机串
      signature: '0e59955f07ccc5f8fc52d1225e5690c25b2d35cb',// 必填，签名，见附录1
      jsApiList: ['startRecord', 'stopRecord', 'pauseVoice', 'pauseVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
    });

    wx.ready(() => {
      console.log('wechat ready');
    });

    wx.error(() => {
      console.log('wechat error');
    });
    
  }

  question = {
    username: '李林昊',
    content: '台湾的生活跟大陆有什么大的差异吗？特别需要注意什么？',
    time: '9天前',

  }

  beginTranscribe(): void {
    console.log('kaishi');
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

  endTranscribe(): void {
    console.log('jieshu');
    this.end = new Date().getTime();
    if ((this.end - this.start < 300)) {
      this.end = 0;
      this.start = 0;
      clearTimeout(this.recordTimer);
    } else {
      wx.stopRecord({
        success: (res) => {
          
        },
        fail: (res) => {
          alert(JSON.stringify(res));
        }
      })
    }
  }

  getAccessToken() {
    this.wxService.getAccessToken()
      .then((res) => {
        console.log(res);
      })
      .catch(error => {
        console.error(error)
      })
  }

  getJsApiTicket() {
    this.wxService.getJsApiTicket()
      .then((res) => {
        console.log(res);
      })
      .catch(error => {
        console.error(error)
      })
  }
}
