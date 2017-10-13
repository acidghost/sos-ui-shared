import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";
import {Environment} from "./shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {Activity, ActivityEvent, ActivityTeach, ActivityType} from "./activities.models";


@Injectable()
export class ActivitiesService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public all<T extends Activity>(
    language: string | null = null,
    search: string | null = null
  ): Observable<T[]> {
    let url = `${this.backendUrl}/activities`;
    let questionMarkAdded = false;

    if (language !== null) {
      url += `?lang=${language}`;
      questionMarkAdded = true;
    }

    if (search !== null) {
      url += `${questionMarkAdded ? '&' : '?'}search=${search}`;
    }

    return this.http.get(url, this.options)
      .map(response => {
        const json = response.json();
        return json.activities.map(activityJson => {
          switch (activityJson.type) {
          case 'teach':
            return ActivityTeach.fromJson(activityJson);
          case 'event':
            return ActivityEvent.fromJson(activityJson);
          default:
            throw new Error(`Unrecognized activity type ${activityJson.type}`);
          }
        })
      }).catch(e => this.catchAuth(e))
  }


  private find<T extends Activity>(
    activityType: ActivityType,
    fromJson: (any) => T,
    id: number,
    lang: string | null
  ): Observable<T> {
    let url = `${this.backendUrl}/activities/${activityType}/${id}`;
    if (lang !== null)
      url += `?lang=${lang}`;

    return this.http.get(url, this.options)
      .map(response => {
        return fromJson(response.json());
      }).catch(e => this.catchAuth(e));
  }

  public findEvent(id: number, lang: string = null): Observable<ActivityEvent> {
    return this.find('event', ActivityEvent.fromJson, id, lang);
  }

  public findTeach(id: number, lang: string = null): Observable<ActivityTeach> {
    return this.find('teach', ActivityTeach.fromJson, id, lang);
  }


  private favorite(activityType: ActivityType, id: number, favorite: boolean): Observable<void> {
    const url = `${this.backendUrl}/activities/${activityType}/${id}/favorite`;
    return this.http.put(url, { favorite: favorite }, this.options)
      .map(() => {})
      .catch(e => this.catchAuth(e));
  }

  public favoriteEvent(id: number, favorite: boolean): Observable<void> {
    return this.favorite('event', id, favorite);
  }

  public favoriteTeach(id: number, favorite: boolean): Observable<void> {
    return this.favorite('teach', id, favorite);
  }


  public favorites(userId: number): Observable<Activity[]> {
    return this.http.get(`${this.backendUrl}/users/${userId}/favorite/activities`, this.options)
      .map(response => {
        const json = response.json();
        return json.activities.map(activityJson => {
          switch (activityJson.type) {
          case 'teach':
            return ActivityTeach.fromJson(activityJson);
          case 'event':
            return ActivityEvent.fromJson(activityJson);
          default:
            throw new Error(`Unrecognized activity type ${activityJson.type}`);
          }
        })
      }).catch(e => this.catchAuth(e))
  }

}
