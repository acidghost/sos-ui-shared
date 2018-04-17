import {Injectable} from "@angular/core";
import {Headers, Http, Request, RequestOptionsArgs, Response} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ConnectionBackend} from "@angular/http/src/interfaces";
import {RequestOptions} from "@angular/http/src/base_request_options";
import {AuthService} from "./auth.service";


@Injectable()
export class HttpOAuth extends Http {

  constructor(backend: ConnectionBackend,
              defaultOptions: RequestOptions,
              private authService: AuthService) {
    super(backend, defaultOptions);
  }

  request(url: string | Request, options?: RequestOptionsArgs): Observable<Response> {
    if (!options)
      options = new RequestOptions();
    if (!options.headers)
      options.headers = new Headers();
    options.headers.set('Authorization', `Bearer ${this.authService.accessToken}`);

    return super.request(url, options).catch(e => {
      if (e.status === 401) {
        return this.authService.implicitFlow().flatMap(token => {
          options.headers.set('Authorization', `Bearer ${token}`);
          return this.request(url, options);
        });
      }

      return Observable.throw(e);
    });
  }

}
