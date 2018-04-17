import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs";
import {BazaarTeach} from "./shared";
import {UserService} from "./user.service";
import {BazaarIdeasService} from "./bazaar-ideas.service";


@Injectable()
export class BazaarTeachResolver implements Resolve<BazaarTeach> {

  constructor(private userService: UserService,
              private bazaarIdeaService: BazaarIdeasService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarTeach> {
    return this.bazaarIdeaService.findTeach(parseInt(route.params['id']));
  }

}
