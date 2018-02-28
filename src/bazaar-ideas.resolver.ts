import {Injectable} from "@angular/core";
import {ApiResolver} from "./api.resolver";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {BazaarIdeas, BazaarIdeaSlim} from "./shared";
import {Observable} from "rxjs";
import {AuthService} from "./auth.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarIdeasResolver extends ApiResolver implements Resolve<BazaarIdeas> {

  constructor(authService: AuthService, private bazaarIdeaService: BazaarIdeasService) {
    super(authService, bazaarIdeaService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarIdeas> {
    return this.bazaarIdeaService.all();
  }

}


@Injectable()
export class BazaarIdeasSlimResolver extends ApiResolver implements Resolve<BazaarIdeaSlim[]> {

  constructor(authService: AuthService, private bazaarIdeaService: BazaarIdeasService) {
    super(authService, bazaarIdeaService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarIdeaSlim[]> {
    return this.bazaarIdeaService.allSlim();
  }

}
