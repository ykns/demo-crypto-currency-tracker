import { Injectable, OnDestroy } from '@angular/core';
import { Observable, of, pipe } from 'rxjs';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { filter, map, retryWhen, delay, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class WebsocketWrapperService implements OnDestroy {

  public connection$: WebSocketSubject<any>;

  public receivedMessages$: Observable<any>[] = [];

  constructor() { }

  public connect(url: string, retryInSeconds: number = 10): Observable<any> {
    return of(url).pipe(
      filter(apiUrl => !!apiUrl),
      // http -> ws, https -> wss
      map(_ => _.replace(/^http/, 'ws')),
      switchMap(apiUrl => {
        if (this.connection$) {
          return this.connection$;
        } else {
          this.connection$ = webSocket(apiUrl);
          return this.connection$;
        }
      }),
      retryWhen((errors => errors.pipe(delay(retryInSeconds))))
    );
  }

  public send(data: any) {
    if (!this.connection$) {
      throw new Error(`Not connected`);
    }

    this.connection$.next({
      ...data,
    });
  }

  public disconnect() {
    if (!this.connection$) {
      return;
    }

    this.connection$.complete();
    this.connection$ = null;
  }

  ngOnDestroy(): void {
    this.disconnect();
  }
}
