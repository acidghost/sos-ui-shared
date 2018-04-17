import {Injectable} from "@angular/core";
import {BazaarComment, Environment, IdeaType} from "./shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";


@Injectable()
export class BazaarCommentsService extends ApiService {

  private readonly baseUrl: string;

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
    this.baseUrl = `${this.backendUrl}/bazaar_ideas`;
  }

  private getUrl(ideaId: number, ideaType: IdeaType): string {
    return `${this.baseUrl}/${ideaType}/${ideaId}/comments`;
  }

  private find(ideaId: number, ideaType: IdeaType): Observable<BazaarComment[]> {
    return this.http.get(this.getUrl(ideaId, ideaType), this.options)
      .map(response => {
        const json = response.json();
        return json.comments.map(BazaarComment.fromJson);
      });
  }

  public findLearn(ideaId: number): Observable<BazaarComment[]> {
    return this.find(ideaId, 'learn');
  }

  public findTeach(ideaId: number): Observable<BazaarComment[]> {
    return this.find(ideaId, 'teach');
  }

  public findEvent(ideaId: number): Observable<BazaarComment[]> {
    return this.find(ideaId, 'event');
  }

  public findResearch(ideaId: number): Observable<BazaarComment[]> {
    return this.find(ideaId, 'research');
  }


  private create(ideaId: number, ideaType: IdeaType, comment: string): Observable<BazaarComment> {
    return this.http.post(this.getUrl(ideaId, ideaType), { comment: comment }, this.options)
      .map(response => {
        const json = response.json();
        return BazaarComment.fromJson(json);
      });
  }

  public createLearn(ideaId: number, comment: string): Observable<BazaarComment> {
    return this.create(ideaId, 'learn', comment);
  }

  public createTeach(ideaId: number, comment: string): Observable<BazaarComment> {
    return this.create(ideaId, 'teach', comment);
  }

  public createEvent(ideaId: number, comment: string): Observable<BazaarComment> {
    return this.create(ideaId, 'event', comment);
  }

  public createResearch(ideaId: number, comment: string): Observable<BazaarComment> {
    return this.create(ideaId, 'research', comment);
  }


  public destroy(commentId: number): Observable<void> {
    return this.http.delete(`${this.baseUrl}/comments/${commentId}`, this.options)
      .map(() => null);
  }

}
