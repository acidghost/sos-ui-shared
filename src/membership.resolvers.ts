import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {MembershipType} from "./shared";
import {MembershipService} from "./membership.service";


@Injectable()
export class MembershipTypesResolver implements Resolve<MembershipType[]> {

  constructor(private membershipService: MembershipService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.membershipService.allTypes(route.queryParamMap.get('lang'));
  }

}
