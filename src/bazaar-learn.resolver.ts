import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {BazaarLearn} from "./shared";
import {UserService} from "./user.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarLearnResolver implements Resolve<BazaarLearn> {

  constructor(private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarLearn> {
    return this.bazaarIdeaService.findLearn(parseInt(route.params['id']));
  }

}
