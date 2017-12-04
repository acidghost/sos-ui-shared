import {Injectable} from "@angular/core";
import {ApiResolver} from "./api.resolver";
import {AuthService} from "./auth.service";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Activity, ActivityEvent, ActivityResearch, ActivityTeach} from "./activities.models";
import {Observable} from "rxjs/Observable";
import {ActivitiesService} from "./activities.service";


function getLanguageParam(route: ActivatedRouteSnapshot): string | null {
  return route.queryParamMap.has('lang') ? route.queryParamMap.get('lang') : null;
}


@Injectable()
export class ActivitiesResolver extends ApiResolver implements Resolve<Activity[]> {

  constructor(authService: AuthService, private activitiesService: ActivitiesService) {
    super(authService, activitiesService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Activity[]> {
    return this.activitiesService.all(getLanguageParam(route));
  }

}


@Injectable()
export class ActivityEventResolver extends ApiResolver implements Resolve<ActivityEvent> {

  constructor(authService: AuthService, private activitiesService: ActivitiesService) {
    super(authService, activitiesService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityEvent> {
    return this.activitiesService.findEvent(parseInt(route.paramMap.get('id')), getLanguageParam(route));
  }

}

@Injectable()
export class ActivityTeachResolver extends ApiResolver implements Resolve<ActivityTeach> {

  constructor(authService: AuthService, private activitiesService: ActivitiesService) {
    super(authService, activitiesService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityTeach> {
    return this.activitiesService.findTeach(parseInt(route.paramMap.get('id')), getLanguageParam(route));
  }

}

@Injectable()
export class ActivityResearchResolver extends ApiResolver implements Resolve<ActivityResearch> {

  constructor(authService: AuthService, private activitiesService: ActivitiesService) {
    super(authService, activitiesService);
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityResearch> {
    return this.activitiesService.findResearch(parseInt(route.paramMap.get('id')), getLanguageParam(route));
  }

}
