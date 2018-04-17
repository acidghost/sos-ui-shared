import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {
  BazaarEvent,
  BazaarIdea,
  BazaarIdeas,
  BazaarIdeaSlim,
  BazaarLearn,
  BazaarResearch,
  BazaarTeach,
  Environment,
  IdeaType
} from "./shared";
import {AuthService} from "./auth.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";


@Injectable()
export class BazaarIdeasService extends ApiService {

  private readonly baseUrl: string;

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
          event: json.event.map(BazaarEvent.fromJson),
          research: json.research.map(BazaarResearch.fromJson)
        }
      })
  }

  public allSlim(): Observable<BazaarIdeaSlim[]> {
    return this.http.get(`${this.backendUrl}/bazaar_ideas_slim`, this.options)
      .map(response => response.json().ideas.map(BazaarIdeaSlim.fromJson));
  }

  protected allIdea<T extends BazaarIdea>(ideaType: IdeaType, fromJson: (any) => T): Observable<T[]> {
    return this.http.get(`${this.baseUrl}/${ideaType}`, this.options)
      .map(response => {
        const json = response.json();
        return json.ideas.map(fromJson);
      })
  }

  public allTeach(): Observable<BazaarTeach[]> {
    return this.allIdea('teach', BazaarTeach.fromJson);
  }

  public allLearn(): Observable<BazaarLearn[]> {
    return this.allIdea('learn', BazaarLearn.fromJson);
  }

  public allEvent(): Observable<BazaarEvent[]> {
    return this.allIdea('event', BazaarEvent.fromJson);
  }

  public allResearch(): Observable<BazaarResearch[]> {
    return this.allIdea('research', BazaarResearch.fromJson);
  }

  protected find<T extends BazaarIdea>(ideaType: IdeaType, fromJson: (any) => T, id: number): Observable<T> {
    return this.http.get(`${this.baseUrl}/${ideaType}/${id}`, this.options)
      .map(response => {
        const json = response.json();
        return fromJson(json)
      })
  }

  public findTeach(id: number): Observable<BazaarTeach> {
    return this.find('teach', BazaarTeach.fromJson, id);
  }

  public findLearn(id: number): Observable<BazaarLearn> {
    return this.find('learn', BazaarLearn.fromJson, id);
  }

  public findEvent(id: number): Observable<BazaarEvent> {
    return this.find('event', BazaarEvent.fromJson, id);
  }

  public findResearch(id: number): Observable<BazaarResearch> {
    return this.find('research', BazaarResearch.fromJson, id);
  }

  protected create<T extends BazaarIdea>(ideaType: IdeaType, fromJson: (any) => T, idea: T | any): Observable<T> {
    const ideaJson = idea instanceof BazaarIdea ? idea.asJson : idea;
    return this.http.post(`${this.baseUrl}/${ideaType}`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return fromJson(json)
      })
  }

  public createTeach(idea: BazaarTeach | any): Observable<BazaarTeach> {
    return this.create('teach', BazaarTeach.fromJson, idea);
  }

  public createLearn(idea: BazaarLearn | any): Observable<BazaarLearn> {
    return this.create('learn', BazaarLearn.fromJson, idea);
  }

  public createEvent(idea: BazaarEvent | any): Observable<BazaarEvent> {
    return this.create('event', BazaarEvent.fromJson, idea);
  }

  public createResearch(idea: BazaarResearch | any): Observable<BazaarResearch> {
    return this.create('research', BazaarResearch.fromJson, idea);
  }

  protected update<T extends BazaarIdea>(ideaType: IdeaType, fromJson: (any) => T, idea: T | any): Observable<T> {
    const ideaJson = idea instanceof BazaarIdea ? idea.asJson : idea;
    return this.http.put(`${this.baseUrl}/${ideaType}/${idea.id}`, ideaJson, this.options)
      .map(response => {
        const json = response.json();
        return fromJson(json)
      })
  }

  public updateLearn(idea: BazaarLearn | any): Observable<BazaarLearn> {
    return this.update('learn', BazaarLearn.fromJson, idea);
  }

  public updateTeach(idea: BazaarTeach | any): Observable<BazaarTeach> {
    return this.update('teach', BazaarTeach.fromJson, idea);
  }

  public updateEvent(idea: BazaarEvent | any): Observable<BazaarEvent> {
    return this.update('event', BazaarEvent.fromJson, idea);
  }

  public updateResearch(idea: BazaarResearch | any): Observable<BazaarResearch> {
    return this.update('research', BazaarResearch.fromJson, idea);
  }

  public search(value: string): Observable<BazaarIdea[]> {
    return this.http.get(`${this.baseUrl}?search=${value}`, this.options)
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
          case 'research':
            return BazaarResearch.fromJson(idea);
          default:
            throw new Error(`unrecognized idea type ${idea.type}`);
          }
        })
      })
  }

  public favorites(userId: number = null): Observable<BazaarIdea[]> {
    let user = userId === null ? 'me' : `users/${userId}`;
    return this.http.get(`${this.backendUrl}/${user}/favorite/ideas`, this.options)
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
          case 'research':
            return BazaarResearch.fromJson(idea);
          default:
            throw new Error(`unrecognized idea type ${idea.type}`);
          }
        })
      })
  }

}
