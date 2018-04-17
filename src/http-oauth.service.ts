import {Injectable} from "@angular/core";
import {ConnectionBackend, Headers, Http, Request, RequestOptions, RequestOptionsArgs, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import "rxjs/add/operator/mergeMap";
import {AuthService} from "./auth.service";


@Injectable()
export class HttpOAuth extends Http {

  constructor(backend: ConnectionBackend,
              defaultOptions: RequestOptions,
              private authService: AuthService) {
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

      return Observable.throw(e);
    });
  }

}
