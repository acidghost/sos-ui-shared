import {RequestOptions, Headers} from "@angular/http";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {Environment} from "./shared";


export abstract class ApiService {

  protected backendUrl: string;
  protected options: RequestOptions;

  constructor(protected authService: AuthService, protected environment: Environment) {
    this.options = new RequestOptions;
    this.options.headers = new Headers;
    this.setToken(authService.accessToken);
    this.setBackendUrl(environment.backendUrl);
  }

  public setBackendUrl(backendUrl: string) {
    this.backendUrl = backendUrl;
  }

  public setToken(token: string) {
    this.options.headers.set('Authorization', `Bearer ${token}`);
  }

  protected catchAuth(error) {
    if (error.status === 401) {
      this.authService.implicitFlow();
      return Observable.empty();
    }
    return Observable.throw(error)
  }

}
