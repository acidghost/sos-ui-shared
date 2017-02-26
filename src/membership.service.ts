import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";
import {MembershipType, Membership, Environment} from "./shared";
import {Observable} from "rxjs";
import {Http} from "@angular/http";


@Injectable()
export class MembershipService extends ApiService {

  constructor(private http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public requestNew(type: MembershipType): Observable<Membership> {
    let typeString;
    switch (type) {
      case MembershipType.OnlySos:
        typeString = 'sos';
        break;
      case MembershipType.OnlyFablab:
        typeString = 'fablab';
        break;
      case MembershipType.BothMembership:
        typeString = 'both';
        break;
    }

    return this.http.post(`${this.backendUrl}/membership/new`, { type: typeString }, this.options)
      .map(response => {
        const json = response.json();
        return Membership.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public requestRenewal(): Observable<Membership> {
    return this.http.post(`${this.backendUrl}/membership/renew`, {}, this.options)
      .map(response => {
        const json = response.json();
        return Membership.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  private deleteAction(url: string): Observable<{}> {
    return this.http.delete(url, this.options)
      .catch(e => this.catchAuth(e));
  }

  public deleteRequest(): Observable<{}> {
    return this.deleteAction(`${this.backendUrl}/membership/request`);
  }

  public deleteActive(): Observable<{}> {
    return this.deleteAction(`${this.backendUrl}/membership/active`);
  }

  public deleteRenewal(): Observable<{}> {
    return this.deleteAction(`${this.backendUrl}/membership/renewal`);
  }

}
