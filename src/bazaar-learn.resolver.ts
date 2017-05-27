import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {ApiResolver} from "./api.resolver";
import {BazaarLearn} from "./shared";
import {AuthService} from "./auth.service";
import {UserService} from "./user.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarLearnResolver extends ApiResolver implements Resolve<BazaarLearn> {

  constructor(authService: AuthService,
              private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {
    super(authService, userService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarLearn> {
    return this.bazaarIdeaService.findLearn(parseInt(route.params['id']));
  }

}
