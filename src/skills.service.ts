import {Injectable} from "@angular/core";
import {ApiService} from "./api.service";
import {Environment, Skill, UserSkill} from "./shared";
import {AuthService} from "./auth.service";
import {Http} from "@angular/http";
import {Observable} from "rxjs";


@Injectable()
export class SkillsService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public search(name: string, all: boolean = false): Observable<Skill[]> {
    return this.http.get(`${this.backendUrl}/skills?name=${name}${all ? '&all' : ''}`, this.options)
      .map(response => {
        const json = response.json();
        return json.skills.map(Skill.fromJson)
      });
  }

  public addUserSkill(name: string): Observable<UserSkill> {
    return this.http.post(`${this.backendUrl}/skills`, { name: name }, this.options)
      .map(response => {
        const json = response.json();
        return UserSkill.fromJson(json)
      });
  }

  public deleteUserSkill(userSkillId: number): Observable<{}> {
    return this.http.delete(`${this.backendUrl}/skills/${userSkillId}`, this.options);
  }

}
