import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiResolver} from "./api.resolver";
import {BazaarResearch} from "./shared";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarResearchResolver extends ApiResolver implements Resolve<BazaarResearch> {

  constructor(authService: AuthService,
              private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {
    super(authService, userService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarResearch> {
    return this.bazaarIdeaService.findResearch(parseInt(route.params['id']));
  }

}
