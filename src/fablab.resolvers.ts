import {Injectable} from "@angular/core";
import {ApiResolver} from "./api.resolver";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {FablabMachine} from "./fablab.models";
import {AuthService} from "./auth.service";
import {FablabService} from "./fablab.service";
import {Observable} from "rxjs/Observable";


@Injectable()
export class FablabMachinesResolver extends ApiResolver implements Resolve<FablabMachine[]> {

  constructor(authService: AuthService, private fablabService: FablabService) {
    super(authService, fablabService)
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabMachine[]> {
    return this.fablabService.allMachines();
  }

}


@Injectable()
export class FablabMachineResolver extends ApiResolver implements Resolve<FablabMachine> {

  constructor(authService: AuthService, private fablabService: FablabService) {
    super(authService, fablabService)
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabMachine> {
    return this.fablabService.findMachine(parseInt(route.paramMap.get('id')));
  }

}
