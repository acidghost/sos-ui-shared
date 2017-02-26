import {Injectable} from "@angular/core";
import {Resolve, RouterStateSnapshot, ActivatedRouteSnapshot} from "@angular/router";
import {User} from "./shared";
import {Observable} from "rxjs";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {ApiResolver} from "./api.resolver";


@Injectable()
export class UserResolver extends ApiResolver implements Resolve<User> {

  constructor(authService: AuthService, private userService: UserService) {
    super(authService, userService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<User> {
    return this.userService.find(route.params['id']);
  }

}
