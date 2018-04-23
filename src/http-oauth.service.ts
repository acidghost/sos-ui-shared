import {Inject, Injectable, InjectionToken} from "@angular/core";
import {
  ConnectionBackend,
  Headers,
  Http,
  Request,
  RequestMethod,
  RequestOptions,
  RequestOptionsArgs,
  Response
} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";
import {AuthService} from "./auth.service";
import {Router} from "@angular/router";


export const ERROR_PAGE = new InjectionToken<string>('errorPage');


@Injectable()
export class HttpOAuth extends Http {

  constructor(backend: ConnectionBackend,
              defaultOptions: RequestOptions,
              private authService: AuthService,
              private router: Router,
              @Inject(ERROR_PAGE) private errorPage: string) {
    super(backend, defaultOptions);
  }

  protected setAuthHeader(headers: Headers, token?: string): void {
    let t = token || this.authService.accessToken;
    headers.set('Authorization', `Bearer ${t}`);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (url instanceof Request) {
      if (!url.headers)
        url.headers = new Headers();
      this.setAuthHeader(url.headers);
    }

    if (!options)
      options = new RequestOptions();
    if (!options.headers)
      options.headers = new Headers();
    this.setAuthHeader(options.headers);

    return super.request(url, options).catch(e => {
      if (e.status === 401) {
        return this.authService.implicitFlow().flatMap(token => {
          this.setAuthHeader(options.headers, token);
          if (url instanceof Request)
            this.setAuthHeader(url.headers, token);
          return super.request(url, options);
        });
      }

      const isGetReq = (url instanceof Request) && url.method === RequestMethod.Get;

      if (isGetReq && e.status === 404) {
        return Observable.of(this.router.navigate([this.errorPage])).flatMap(() => {
          return Observable.throw(new Error(`Resource not found: ${e.url}`));
        });
      }

      return Observable.throw(e);
    });
  }

}
