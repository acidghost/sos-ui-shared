import {ApiService} from "./api.service";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Environment} from "./shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {FablabMachine} from "./fablab.models";


@Injectable()
export class FablabService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public allMachines(): Observable<FablabMachine[]> {
    return this.http.get(`${this.backendUrl}/fablab/machines`, this.options)
      .map(response => response.json().machines)
      .catch(e => this.catchAuth(e));
  }

  public findMachine(id: number): Observable<FablabMachine> {
    return this.http.get(`${this.backendUrl}/fablab/machines/${id}`, this.options)
      .map(response => response.json())
      .catch(e => this.catchAuth(e));
  }

}
