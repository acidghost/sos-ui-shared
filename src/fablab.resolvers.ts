import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {FablabMachine, FablabReservation} from "./fablab.models";
import {FablabService} from "./fablab.service";
import {Observable} from "rxjs/Observable";


@Injectable()
export class FablabMachinesResolver implements Resolve<FablabMachine[]> {

  constructor(private fablabService: FablabService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabMachine[]> {
    return this.fablabService.allMachines();
  }

}


@Injectable()
export class FablabMachineResolver implements Resolve<FablabMachine> {

  constructor(private fablabService: FablabService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabMachine> {
    return this.fablabService.findMachine(parseInt(route.paramMap.get('id')));
  }

}


@Injectable()
export class FablabMachineReservationsResolver implements Resolve<FablabReservation[]> {

  constructor(private fablabService: FablabService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabReservation[]> {
    return this.fablabService.machineReservations(parseInt(route.paramMap.get('id')));
  }

}


@Injectable()
export class FablabUserReservationsResolver implements Resolve<FablabReservation[]> {

  constructor(private fablabService: FablabService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<FablabReservation[]> {
    return this.fablabService.userReservations(true);
  }

}
