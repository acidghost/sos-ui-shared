import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
import {Observable} from "rxjs/Observable";
import {BazaarComment} from "./shared";
import {BazaarCommentsService} from "./bazaar-comments.service";
import {Injectable} from "@angular/core";


abstract class BazaarCommentResolver implements Resolve<BazaarComment[]> {

  protected abstract find(ideaId: number): Observable<BazaarComment[]>

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<BazaarComment[]> {
    const id = route.params['id'] ? route.params['id'] : route.parent.params['id'];
    return this.find(parseInt(id));
  }

}

@Injectable()
export class BazaarCommentsLearnResolver extends BazaarCommentResolver {
  constructor(private bazaarCommentsService: BazaarCommentsService) {
    super();
  }
  protected find(ideaId: number): Observable<BazaarComment[]> {
    return this.bazaarCommentsService.findLearn(ideaId);
  }
}

@Injectable()
export class BazaarCommentsTeachResolver extends BazaarCommentResolver {
  constructor(private bazaarCommentsService: BazaarCommentsService) {
    super();
  }
  protected find(ideaId: number): Observable<BazaarComment[]> {
    return this.bazaarCommentsService.findTeach(ideaId);
  }
}

@Injectable()
export class BazaarCommentsEventResolver extends BazaarCommentResolver {
  constructor(private bazaarCommentsService: BazaarCommentsService) {
    super();
  }
  protected find(ideaId: number): Observable<BazaarComment[]> {
    return this.bazaarCommentsService.findEvent(ideaId);
  }
}

@Injectable()
export class BazaarCommentsResearchResolver extends BazaarCommentResolver {
  constructor(private bazaarCommentsService: BazaarCommentsService) {
    super();
  }
  protected find(ideaId: number): Observable<BazaarComment[]> {
    return this.bazaarCommentsService.findResearch(ideaId);
  }
}
