import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {BazaarIdeas, BazaarIdeaSlim} from "./shared";
import {Observable} from "rxjs";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarIdeasResolver implements Resolve<BazaarIdeas> {

  constructor(private bazaarIdeaService: BazaarIdeasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarIdeas> {
    return this.bazaarIdeaService.all();
  }

}


@Injectable()
export class BazaarIdeasSlimResolver implements Resolve<BazaarIdeaSlim[]> {

  constructor(private bazaarIdeaService: BazaarIdeasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarIdeaSlim[]> {
    return this.bazaarIdeaService.allSlim();
  }

}
