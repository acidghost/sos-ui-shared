import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {BazaarEvent, BazaarIdea, BazaarIdeas, BazaarLearn, BazaarTeach, Environment} from "./shared";
import {AuthService} from "./auth.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";


@Injectable()
export class BazaarIdeasService extends ApiService {

  private baseUrl: string;

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
    this.baseUrl = `${this.backendUrl}/bazaar_ideas`;
  }

  public all(): Observable<BazaarIdeas> {
    return this.http.get(this.baseUrl, this.options)
      .map(response => {
        const json = response.json();
        return {
          teach: json.teach.map(BazaarTeach.fromJson),
          learn: json.learn.map(BazaarLearn.fromJson),
          event: json.event.map(BazaarEvent.fromJson)
        }
      }).catch(e => this.catchAuth(e))
  }

  public allTeach(): Observable<BazaarTeach[]> {
    return this.http.get(`${this.baseUrl}/teach`, this.options)
      .map(response => {
        const json = response.json();
        return BazaarTeach.fromJson(json.idea)
      }).catch(e => this.catchAuth(e))
  }

  public allLearn(): Observable<BazaarLearn[]> {
    return this.http.get(`${this.baseUrl}/learn`, this.options)
      .map(response => {
        const json = response.json();
        return BazaarLearn.fromJson(json.idea)
      }).catch(e => this.catchAuth(e))
  }

  public allEvent(): Observable<BazaarEvent[]> {
    return this.http.get(`${this.baseUrl}/event`, this.options)
      .map(response => {
        const json = response.json();
        return BazaarEvent.fromJson(json.idea)
      }).catch(e => this.catchAuth(e))
  }

  public findTeach(id: number): Observable<BazaarTeach> {
    return this.http.get(`${this.baseUrl}/teach/${id}`, this.options)
      .map(response => {
        const json = response.json();
        return BazaarTeach.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public findLearn(id: number): Observable<BazaarLearn> {
    return this.http.get(`${this.baseUrl}/learn/${id}`, this.options)
      .map(response => {
        const json = response.json();
        return BazaarLearn.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public findEvent(id: number): Observable<BazaarEvent> {
    return this.http.get(`${this.baseUrl}/event/${id}`, this.options)
      .map(response => {
        const json = response.json();
        return BazaarEvent.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public createTeach(idea: BazaarTeach | any): Observable<BazaarTeach> {
    const ideaJson = idea instanceof BazaarTeach ? idea.asJson : idea;
    return this.http.post(`${this.baseUrl}/teach`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return BazaarTeach.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public createLearn(idea: BazaarLearn | any): Observable<BazaarLearn> {
    const ideaJson = idea instanceof BazaarLearn ? idea.asJson : idea;
    return this.http.post(`${this.baseUrl}/learn`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return BazaarLearn.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public createEvent(idea: BazaarEvent | any): Observable<BazaarEvent> {
    const ideaJson = idea instanceof BazaarEvent ? idea.asJson : idea;
    return this.http.post(`${this.baseUrl}/event`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return BazaarEvent.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public updateLearn(idea: BazaarLearn | any): Observable<BazaarLearn> {
    const ideaJson = idea instanceof BazaarLearn ? idea.asJson : idea;
    return this.http.put(`${this.baseUrl}/learn/${idea.id}`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return BazaarLearn.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public updateTeach(idea: BazaarTeach | any): Observable<BazaarTeach> {
    const ideaJson = idea instanceof BazaarTeach ? idea.asJson : idea;
    return this.http.put(`${this.baseUrl}/teach/${idea.id}`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return BazaarTeach.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public updateEvent(idea: BazaarEvent | any): Observable<BazaarEvent> {
    const ideaJson = idea instanceof BazaarEvent ? idea.asJson : idea;
    return this.http.put(`${this.baseUrl}/event/${idea.id}`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return BazaarEvent.fromJson(json)
      }).catch(e => this.catchAuth(e))
  }

  public search(value: string): Observable<BazaarIdea[]> {
    return this.http.get(this.baseUrl, this.options)
      .map(response => {
        const json = response.json();
        return json.ideas.map(idea => {
          switch (idea.type) {
          case 'learn':
            return BazaarLearn.fromJson(idea);
          case 'teach':
            return BazaarTeach.fromJson(idea);
          case 'event':
            return BazaarEvent.fromJson(idea);
          default:
            throw new Error(`unrecognized idea type ${idea.type}`);
          }
        })
      }).catch(e => this.catchAuth(e))
  }

}
