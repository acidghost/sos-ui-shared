import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiResolver} from "./api.resolver";
import {BazaarIdea} from "./shared";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarIdeaResolver extends ApiResolver implements Resolve<BazaarIdea> {

  constructor(authService: AuthService,
              private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {
    super(authService, userService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarIdea> {
    return this.bazaarIdeaService.find(parseInt(route.params['id']));
  }

}
