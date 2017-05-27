import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiResolver} from "./api.resolver";
import {BazaarEvent} from "./shared";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarEventResolver extends ApiResolver implements Resolve<BazaarEvent> {

  constructor(authService: AuthService,
              private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {
    super(authService, userService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarEvent> {
    return this.bazaarIdeaService.findEvent(parseInt(route.params['id']));
  }

}
