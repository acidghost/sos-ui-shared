import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";
import {Environment, Membership, MembershipType} from "./shared";
import {Observable} from "rxjs";
import {Http} from "@angular/http";


@Injectable()
export class MembershipService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public requestNew(membershipTypeId: number): Observable<Membership> {
    return this.http.post(`${this.backendUrl}/membership/new`, { type: membershipTypeId }, this.options)
      .map(response => {
        const json = response.json();
        return Membership.fromJson(json)
      })
  }

  public requestRenewal(): Observable<Membership> {
    return this.http.post(`${this.backendUrl}/membership/renew`, {}, this.options)
      .map(response => {
        const json = response.json();
        return Membership.fromJson(json)
      })
  }

  private deleteAction(url: string): Observable<{}> {
    return this.http.delete(url, this.options);
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

  public allTypes(lang?: string): Observable<MembershipType[]> {
    let url = `${this.backendUrl}/membership_types`;
    if (lang)
      url += '?lang=' + lang;
    return this.http.get(url, this.options)
      .map(response => {
        const json = response.json();
        return json.types.map(MembershipType.fromJson);
      });
  }

}
