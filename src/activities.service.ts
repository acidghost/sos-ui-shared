import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";
import {Environment} from "./shared";
import {Observable} from "rxjs/Observable";
import {
  Activity,
  ActivityEvent,
  ActivityEventSlim,
  ActivityResearch,
  ActivityResearchApp,
  ActivityResearchRole,
  ActivityResearchSlim,
  ActivitySlim,
  ActivitySubscription,
  ActivityTeach,
  ActivityTeachSlim,
  ActivityType,
  PaymentInfoRequest
} from "./activities.models";
import {CodeMatcher, HttpOAuth} from "./http-oauth.service";


export interface ResearchAppRequest {
  apply: boolean,
  motivation?: string
}


@Injectable()
export class ActivitiesService extends ApiService {

  constructor(protected http: HttpOAuth, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public all(
    language: string | null = null,
    search: string | null = null,
    skillIds: number[] = null,
    matchAll: boolean = false,
    future: boolean = false
  ): Observable<ActivitySlim[]> {
    let url = `${this.backendUrl}/activities`;
    let questionMarkAdded = false;

    if (language !== null) {
      url += `?lang=${language}`;
      questionMarkAdded = true;
    }

    if (search != null) {
      url += `${questionMarkAdded ? '&' : '?'}search=${search}`;
      questionMarkAdded = true;
    }

    if (skillIds !== null && skillIds.length > 0) {
      url += questionMarkAdded ? '&' : '?';
      questionMarkAdded = true;
      url += skillIds.map(sid => `skillId=${sid}`).join('&');
      if (matchAll)
        url += '&matchAll';
    }

    if (future) {
      url += (questionMarkAdded ? '&' : '?') + 'future';
    }

    return this.http.get(url, this.options)
      .map(response => {
        const json = response.json();
        return json.activities.map(activityJson => {
          switch (activityJson.type) {
          case 'teach':
            return ActivityTeachSlim.fromJson(activityJson);
          case 'event':
            return ActivityEventSlim.fromJson(activityJson);
          case 'research':
            return ActivityResearchSlim.fromJson(activityJson);
          default:
            throw new Error(`Unrecognized activity type ${activityJson.type}`);
          }
        })
      })
  }

  protected allByType<T extends ActivitySlim>(future: boolean, type: ActivityType, f: (any) => T): Observable<T[]>  {
    let url = `${this.backendUrl}/activities/${type}`;
    if (future)
      url += '?future';

    return this.http.get(url, this.options).map(response => {
      return response.json().activities.map(f);
    });
  }

  public allTeach(future: boolean): Observable<ActivityTeachSlim[]> {
    return this.allByType(future, 'teach', ActivityTeachSlim.fromJson);
  }

  public allEvent(future: boolean): Observable<ActivityEventSlim[]> {
    return this.allByType(future, 'event', e => ActivityEventSlim.fromJson(e));
  }

  public allResearch(future: boolean): Observable<ActivityResearchSlim[]> {
    return this.allByType(future, 'research', ActivityResearchSlim.fromJson);
  }


  private find<T extends Activity>(
    activityType: ActivityType,
    fromJson: (any) => T,
    id: number,
    lang: string | null,
    catchCodes: CodeMatcher[]
  ): Observable<T> {
    let url = `${this.backendUrl}/activities/${activityType}/${id}`;
    if (lang !== null)
      url += `?lang=${lang}`;

    return this.http.get(url, this.options, catchCodes)
      .map(response => {
        return fromJson(response.json());
      });
  }

  public findEvent(id: number, lang: string = null,
                   catchCodes: CodeMatcher[] = HttpOAuth.defaultCodeMatchers): Observable<ActivityEvent> {
    return this.find('event', ActivityEvent.fromJson, id, lang, catchCodes);
  }

  public findTeach(id: number, lang: string = null,
                   catchCodes: CodeMatcher[] = HttpOAuth.defaultCodeMatchers): Observable<ActivityTeach> {
    return this.find('teach', ActivityTeach.fromJson, id, lang, catchCodes);
  }

  public findResearch(id: number, lang: string = null,
                      catchCodes: CodeMatcher[] = HttpOAuth.defaultCodeMatchers): Observable<ActivityResearch> {
    return this.find('research', ActivityResearch.fromJson, id, lang, catchCodes);
  }


  private favorite(activityType: ActivityType, id: number, favorite: boolean): Observable<void> {
    const url = `${this.backendUrl}/activities/${activityType}/${id}/favorite`;
    return this.http.put(url, { favorite: favorite }, this.options)
      .map(() => {});
  }

  public favoriteEvent(id: number, favorite: boolean): Observable<void> {
    return this.favorite('event', id, favorite);
  }

  public favoriteTeach(id: number, favorite: boolean): Observable<void> {
    return this.favorite('teach', id, favorite);
  }

  public favoriteResearch(id: number, favorite: boolean): Observable<void> {
    return this.favorite('research', id, favorite);
  }


  public favorites(userId: number = null): Observable<ActivitySlim[]> {
    let user = userId === null ? 'me' : `users/${userId}`;
    return this.http.get(`${this.backendUrl}/${user}/favorite/activities`, this.options)
      .map(response => {
        const json = response.json();
        return json.activities.map(activityJson => {
          switch (activityJson.type) {
          case 'teach':
            return ActivityTeachSlim.fromJson(activityJson);
          case 'event':
            return ActivityEventSlim.fromJson(activityJson);
          case 'research':
            return ActivityResearchSlim.fromJson(activityJson);
          default:
            throw new Error(`Unrecognized activity type ${activityJson.type}`);
          }
        })
      })
  }


  private subscribe(activityType: ActivityType, id: number, paymentInfo: PaymentInfoRequest | null): Observable<ActivitySubscription> {
    return this.http.put(`${this.backendUrl}/activities/${activityType}/${id}/subscription`, paymentInfo, this.options)
      .map(response => {
        const json = response.json();
        return {
          createdAt: new Date(json.createdAt),
          paymentMethod: json.paymentMethod,
          verified: json.verified,
          cro: json.cro
        };
      });
  }

  public subscribeEvent(id: number, paymentInfo: PaymentInfoRequest | null = null): Observable<ActivitySubscription> {
    return this.subscribe('event', id, paymentInfo);
  }

  public subscribeTeach(id: number, paymentInfo: PaymentInfoRequest | null = null): Observable<ActivitySubscription> {
    return this.subscribe('teach', id, paymentInfo);
  }

  public applications(id: number): Observable<ActivityResearchRole[]> {
    return this.http.get(`${this.backendUrl}/activities/research/${id}/applications`, this.options)
      .map(response => {
        const json = response.json();
        return json.applications.map(ActivityResearchRole.fromJson);
      });
  }

  public changeApplication(roleId: number, app: ResearchAppRequest): Observable<ActivityResearchApp | null> {
    return this.http.put(`${this.backendUrl}/activities/research/${roleId}/application`, app, this.options)
      .map(response => {
        const json = response.json();
        return json ? {
          userId: json.userId,
          motivation: json.motivation,
          createdAt: new Date(json.createdAt)
        } : null;
      });
  }

}
