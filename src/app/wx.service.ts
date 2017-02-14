import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { wxConfig } from './config';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class WxService {

  private AccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?';
  private AccessToken = 'w2UUDDLTP0QxBDET-aa4PRxO2eLdCVG3ciyKjtbrz2K_mJzCNOpVuKMxiwQjBctVVVVyLcZmfzaceKChxGfcbo-wYG8do2HBX6Q3qpkaZCEDix7ApaVJqQYxQ89h_S-LDPTiAFAXJN';
  private JsApiTicket = 'kgt8ON7yVITDhtdwci0qeW9vcC1vl2nxOOI235ZFl1W-A8WnM11R31kLFJ40qbjkU3Cx1HAbixxpTiYFnFs3Gg';

  private JsapiTicketUrl = 'https://api.weixin.qq.com/cgi-bin/ticket/getticket?';

  constructor(
    private http: Http
  ) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  getAccessToken() :Promise<string> {
    if (this.AccessToken) return Promise.resolve(this.AccessToken);
    const url = `${this.AccessTokenUrl}grant_type=${wxConfig.grantType}&appid=${wxConfig.appId}&secret=${wxConfig.appSecret}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError)  
  }

  getJsApiTicket() :Promise<string> {
    if (this.JsApiTicket) return Promise.resolve(this.JsApiTicket);
    const url = `${this.JsapiTicketUrl}access_token=${this.AccessToken}&type=jsapi`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data)
      .catch(this.handleError)  
  }

  getSign(jsApiTicket, localUrl) {
    return this.http.get(`api/sign?jsApiTicket=${jsApiTicket}&localUrl=${localUrl}`)
      .toPromise()
      .then((res) => res.json())
      .catch(this.handleError)
  }
}
