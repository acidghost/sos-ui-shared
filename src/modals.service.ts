import {EventEmitter, Injectable} from "@angular/core";
import {Observable} from "rxjs/Observable";


export type ModalOptions = {
  title: string, content: string, close: string, accept: string, keyboard?: boolean,
  emitter: EventEmitter<boolean> }


@Injectable()
export class ModalsService {

  private displayObs: EventEmitter<ModalOptions> = new EventEmitter<ModalOptions>();

  constructor() {}

  public show(modalOptions: ModalOptions) {
    this.displayObs.emit(modalOptions);
  }

  public onShow(cb: (ModalOptions) => void): Observable<ModalOptions> {
    return this.displayObs.subscribe(cb);
  }

}
