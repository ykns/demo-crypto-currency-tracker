import { TestBed } from '@angular/core/testing';

import { WebsocketWrapperService } from './websocket-wrapper.service';
import { environment } from 'src/environments/environment';
import { delay } from 'rxjs/operators';
import { webSocket } from "rxjs/webSocket";

describe('WebsocketWrapperService', () => {
  let service: WebsocketWrapperService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsocketWrapperService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

});
