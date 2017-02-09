/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { WxService } from './wx.service';

describe('WxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WxService]
    });
  });

  it('should ...', inject([WxService], (service: WxService) => {
    expect(service).toBeTruthy();
  }));
});
