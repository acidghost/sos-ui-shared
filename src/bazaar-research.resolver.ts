import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {BazaarResearch} from "./shared";
import {UserService} from "./user.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarResearchResolver implements Resolve<BazaarResearch> {

  constructor(private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarResearch> {
    return this.bazaarIdeaService.findResearch(parseInt(route.params['id']));
  }

}
