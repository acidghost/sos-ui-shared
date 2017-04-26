import {Injectable} from "@angular/core";


export class AuthServiceConfig {

  public authUrl: string;
  public clientId: string;
  public redirectUri: string;
  public scope: string;
  public logoutUrl: string;

  constructor(params: {
    authUrl?: string,
    clientId?: string,
    redirectUri?: string,
    scope?: string,
    logoutUrl: string
  }) {
    if (params.authUrl) this.authUrl = params.authUrl;
    if (params.clientId) this.clientId = params.clientId;
    if (params.redirectUri) this.redirectUri = params.redirectUri;
    if (params.scope) this.scope = params.scope;
    this.logoutUrl = params.logoutUrl;
  }

  public get implicitAuthUrl(): string {
    let url = `${this.authUrl}?`;
    if (this.clientId)
      url += `client_id=${this.clientId}&`;
    if (this.scope)
      url += `scope=${this.scope}&`;
    if (this.redirectUri)
      url += `redirect_uri=${this.redirectUri}&`;
    url += 'grant_type=implicit';
    return url;
  }

}


@Injectable()
export class AuthService {

  private storage: Storage = localStorage;

  constructor(private config: AuthServiceConfig) { }

  get accessToken(): string|null {
    return this.storage.getItem('access_token');
  }

  set accessToken(token: string) {
    this.storage.setItem('access_token', token);
  }

  removeToken() {
    this.storage.removeItem('access_token');
  }

  get logoutUrl(): string {
    return this.config.logoutUrl;
  }

  catchToken(): string|null {
    let parts = AuthService.getFragment();
    if (parts['token']) {
      this.accessToken = parts['token'];
    }
    return this.accessToken;
  }

  implicitFlow(): void {
    window.location.href = this.config.implicitAuthUrl;
  }

  private static getFragment() {
    if (window.location.hash.indexOf("#") === 0) {
      return AuthService.parseQueryString(window.location.hash.substr(1));
    } else {
      return {};
    }
  }

  private static parseQueryString(queryString: string) {
    let data = {};

    if (queryString === null) {
      return data;
    }

    let pairs: string[] = queryString.split("&");

    for (let i = 0; i < pairs.length; i++) {
      let pair = pairs[i];
      let separatorIndex = pair.indexOf("=");
      let escapedKey: string;
      let escapedValue: string|null;

      if (separatorIndex === -1) {
        escapedKey = pair;
        escapedValue = null;
      } else {
        escapedKey = pair.substr(0, separatorIndex);
        escapedValue = pair.substr(separatorIndex + 1);
      }

      let key = decodeURIComponent(escapedKey);
      let value = decodeURIComponent(escapedValue);

      if (key.substr(0, 1) === '/')
        key = key.substr(1);

      data[key] = value;
    }

    return data;
  }

}
