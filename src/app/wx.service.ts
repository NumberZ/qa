import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { wxConfig } from './config';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class WxService {

  private AccessTokenUrl = 'https://api.weixin.qq.com/cgi-bin/token?';
  private AccessToken = 'KbKRaVhtRicqTIFJehQe6uuj9de1Ut7Onft8SXNt8T_-S50uYMTAsFEG-qkdtjNX_X7q4Q3KDPwniAFtboGP4kEVPIUBXcD9bRbRU5C1djlo1YGQXGw5BN0g1iwDQCTYJECgAGAVQO';
  private JsApiTicket = 'kgt8ON7yVITDhtdwci0qeW9vcC1vl2nxOOI235ZFl1UmVbuQZ7vffmnkwkBJJtAfsK-Nofq-DNkbiMEFNmQGXw';

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
}
