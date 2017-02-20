import { Injectable } from '@angular/core';
import { Http } from '@angular/http';

import { wxConfig } from './config';
import 'rxjs/add/operator/toPromise';


@Injectable()
export class WxService {

  constructor(
    private http: Http
  ) { }

  private handleError(error: any): Promise<any> {
    console.error('An error occured', error);
    return Promise.reject(error.message || error);
  }

  getSign(localUrl: string) {
    return this.http.get(`api/sign?&localUrl=${localUrl}`)
      .toPromise()
      .then((res) => res.json())
      .catch(this.handleError)
  }
}
