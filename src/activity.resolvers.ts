import {Injectable} from "@angular/core";
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {
  Activity,
  ActivityEvent,
  ActivityEventSlim,
  ActivityResearch,
  ActivityResearchRole,
  ActivityResearchSlim,
  ActivityTeach,
  ActivityTeachSlim
} from "./activities.models";
import {Observable} from "rxjs/Observable";
import {ActivitiesService} from "./activities.service";


function getLanguageParam(route: ActivatedRouteSnapshot): string | null {
  return route.queryParamMap.has('lang') ? route.queryParamMap.get('lang') : null;
}


@Injectable()
export class ActivitiesResolver implements Resolve<Activity[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Activity[]> {
    return this.activitiesService.all(getLanguageParam(route));
  }

}


@Injectable()
export class ActivitiesTeachResolver implements Resolve<ActivityTeachSlim[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityTeachSlim[]> {
    return this.activitiesService.allTeach(false);
  }

}

@Injectable()
export class ActivitiesTeachFutureResolver implements Resolve<ActivityTeachSlim[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityTeachSlim[]> {
    return this.activitiesService.allTeach(true);
  }

}

@Injectable()
export class ActivitiesEventResolver implements Resolve<ActivityEventSlim[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityEventSlim[]> {
    return this.activitiesService.allEvent(false);
  }

}

@Injectable()
export class ActivitiesEventFutureResolver implements Resolve<ActivityEventSlim[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityEventSlim[]> {
    return this.activitiesService.allEvent(true);
  }

}

@Injectable()
export class ActivitiesResearchResolver implements Resolve<ActivityResearchSlim[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityResearchSlim[]> {
    return this.activitiesService.allResearch(false);
  }

}

@Injectable()
export class ActivitiesResearchFutureResolver implements Resolve<ActivityResearchSlim[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityResearchSlim[]> {
    return this.activitiesService.allResearch(true);
  }

}


@Injectable()
export class ActivityEventResolver implements Resolve<ActivityEvent> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityEvent> {
    return this.activitiesService.findEvent(parseInt(route.paramMap.get('id')), getLanguageParam(route));
  }

}

@Injectable()
export class ActivityTeachResolver implements Resolve<ActivityTeach> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityTeach> {
    return this.activitiesService.findTeach(parseInt(route.paramMap.get('id')), getLanguageParam(route));
  }

}

@Injectable()
export class ActivityResearchResolver implements Resolve<ActivityResearch> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityResearch> {
    return this.activitiesService.findResearch(parseInt(route.paramMap.get('id')), getLanguageParam(route));
  }

}

@Injectable()
export class ActivityResearchAppsResolver implements Resolve<ActivityResearchRole[]> {

  constructor(private activitiesService: ActivitiesService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ActivityResearchRole[]> {
    return this.activitiesService.applications(parseInt(route.paramMap.get('id')));
  }

}
