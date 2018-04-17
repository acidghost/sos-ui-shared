import {Injectable} from "@angular/core";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";
import {Environment, Topic} from "./shared";


@Injectable()
export class TopicsService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public search(topic?: string): Observable<Topic[]> {
    let url = `${this.backendUrl}/topics`;
    if (topic)
      url += `?topic=${topic}`;

    return this.http.get(url, this.options)
      .map(response => {
        const json = response.json();
        return json.topics.map(Topic.fromJson);
      })
  }

}
