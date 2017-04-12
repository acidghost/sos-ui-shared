import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {BazaarIdea, Environment} from "./shared";
import {AuthService} from "./auth.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";


@Injectable()
export class BazaarIdeasService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public all(): Observable<[BazaarIdea]> {
    return this.http.get(`${this.backendUrl}/bazaar_ideas`, this.options)
      .map(response => {
        const json = response.json();
        return json['bazaar_ideas'].map(BazaarIdea.fromJson)
      }).catch(e => this.catchAuth(e))
  }

  public find(id: number): Observable<BazaarIdea> {
    return this.http.get(`${this.backendUrl}/bazaar_ideas/${id}`, this.options)
      .map(response => {
        const json = response.json();
        return BazaarIdea.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public create(bazaarIdea: BazaarIdea | any): Observable<BazaarIdea> {
    const ideaJson = bazaarIdea instanceof BazaarIdea ? bazaarIdea.asJson : bazaarIdea;
    return this.http.post(`${this.backendUrl}/bazaar_ideas/`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return BazaarIdea.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

}
