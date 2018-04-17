import {Injectable} from "@angular/core";
import {Http, Response} from "@angular/http";
import {Observable, Subject} from "rxjs";
import "rxjs/add/operator/map";
import "rxjs/add/operator/catch";
import {User, Environment} from "./shared";
import {ApiService} from "./api.service";
import {AuthService} from "./auth.service";


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
  }

  public find(userId: number): Observable<User> {
    return this.http.get(`${this.backendUrl}/users/${userId}`, this.options)
      .map(response => {
        const json = response.json();
        return User.fromJson(json)
      })
  }

  public search(name: string | null, skillIds: number[] = null, matchAll: boolean = false): Observable<User[]> {
    if (name == null && (skillIds === null || skillIds.length < 1))
      throw new Error('invalid arguments');

    let url = `${this.backendUrl}/users?`;

    if (name != null)
      url += `name=${name}`;

    if (skillIds !== null && skillIds.length > 0) {
      if (name !== null) url += '&';
      url += skillIds.map(sid => `skillId=${sid}`).join('&');
      if (matchAll)
        url += '&matchAll';
    }

    return this.http.get(url, this.options)
      .map(response => {
        const json = response.json();
        return json.users.map(User.fromJson)
      })
  }

  public update(user: User | any, skills: { id: number, name: string }[] = null): Observable<User> {
    let userJson = user instanceof User ? user.asJson : user;
    delete userJson.skills;
    if (skills !== null)
      userJson.skills = skills;

    return this.http.put(`${this.backendUrl}/me`, userJson, this.options)
      .map(r => this.mapUserResponse(r))
  }

  public favorite(userId: number, favorite: boolean): Observable<boolean> {
    return this.http.put(`${this.backendUrl}/users/${userId}/favorite`, { favorite: favorite }, this.options)
      .map(response => {
        const json = response.json();
        return json.favorite;
      });
  }

  public favorites(userId: number = null): Observable<User[]> {
    let user = userId === null ? 'me' : `users/${userId}`;
    return this.http.get(`${this.backendUrl}/${user}/favorite/users`, this.options)
      .map(response => {
        const json = response.json();
        return json.users.map(User.fromJson)
      })
  }

}
