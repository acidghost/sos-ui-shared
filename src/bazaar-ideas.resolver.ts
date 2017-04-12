import {Injectable} from "@angular/core";
import {ApiResolver} from "./api.resolver";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {BazaarIdea} from "./shared";
import {Observable} from "rxjs";
import {UserService} from "./user.service";
import {AuthService} from "./auth.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarIdeasResolver extends ApiResolver implements Resolve<[BazaarIdea]> {

  constructor(authService: AuthService,
              private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {
    super(authService, userService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<[BazaarIdea]> {
    return this.bazaarIdeaService.all();
  }

}
