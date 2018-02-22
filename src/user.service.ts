import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {User, Environment} from "./shared";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";
import {isString} from "util";


@Injectable()
export class UserService extends ApiService {

  private userUpdatesSource = new Subject<User>();

  public userUpdated: Observable<User> = this.userUpdatesSource.asObservable();

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public updateUser(user: User): void {
    this.userUpdatesSource.next(user);
  }

  private mapUserResponse(response: Response): User {
    const json = response.json();
    const user = User.fromJson(json);
    this.updateUser(user);
    return user
  }

  public me(): Observable<User> {
    return this.http.get(`${this.backendUrl}/me`, this.options)
      .map(r => this.mapUserResponse(r))
      .catch(e => this.catchAuth(e))
  }

  public find(userId: number): Observable<User> {
    return this.http.get(`${this.backendUrl}/users/${userId}`, this.options)
      .map(response => {
        const json = response.json();
        return User.fromJson(json)
      })
      .catch(e => this.catchAuth(e))
  }

  public search(name: string, skillIds: number[] = null, matchAll: boolean = false): Observable<User[]> {
    let url = `${this.backendUrl}/users?name=${name}`;

    if (skillIds !== null) {
      skillIds.forEach((sid, i) => {
        url += `&skillId[${i}]=${sid}`;
      });
      if (matchAll)
        url += '&matchAll';
    }

    return this.http.get(url, this.options)
      .map(response => {
        const json = response.json();
        return json.users.map(User.fromJson)
      })
      .catch(e => this.catchAuth(e))
  }

  public update(user: User | any): Observable<User> {
    let userJson = user instanceof User ? user.asJson : user;
    return this.http.put(`${this.backendUrl}/me`, userJson, this.options)
      .map(r => this.mapUserResponse(r))
      .catch(e => this.catchAuth(e))
  }

  public favorite(userId: number, favorite: boolean): Observable<boolean> {
    return this.http.put(`${this.backendUrl}/users/${userId}/favorite`, { favorite: favorite }, this.options)
      .map(response => {
        const json = response.json();
        return json.favorite;
      })
      .catch(e => this.catchAuth(e));
  }

  public favorites(userId: number): Observable<User[]> {
    return this.http.get(`${this.backendUrl}/users/${userId}/favorite/users`, this.options)
      .map(response => {
        const json = response.json();
        return json.users.map(User.fromJson)
      })
      .catch(e => this.catchAuth(e))
  }

}
