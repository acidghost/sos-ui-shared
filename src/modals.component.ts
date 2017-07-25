import {Component, OnInit} from "@angular/core";
import {ModalOptions, ModalsService} from "./modals.service";

declare const $: any;

const modalSelector = "#sos-modal";


@Component({
  selector: 'sos-modals',
  template: `
    <div *ngIf="options" id="sos-modal" class="modal fade" 
         tabindex="-1" role="dialog" aria-labelledby="sos-modals-label" aria-hidden="true">
      <div class="modal-dialog modal-sm">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="exampleModalLabel" [innerHTML]="options.title"></h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body" [innerHTML]="options.content"></div>
          <div class="modal-footer">
            <button type="button" class="btn btn-sm btn-danger" (click)="dismissModal(false)" [innerHTML]="options.close"></button>
            <button type="button" class="btn btn-sm btn-success" (click)="dismissModal(true)" [innerHTML]="options.accept"></button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class ModalsComponent implements OnInit {

  public options: ModalOptions;

  constructor(private modalsService: ModalsService) {}

  ngOnInit(): void {
    this.modalsService.onShow(opt => {
      this.options = opt;
      // timeout is needed to allow angular to show the modal because of the *ngIf that's hiding it
      window.setTimeout(() => {
        $(modalSelector).modal({
          keyboard: this.options.keyboard || true,
          show: true
        });
      }, 10);
    });
  }

  // noinspection JSMethodCanBeStatic
  dismissModal(result: boolean) {
    $(modalSelector).modal('hide');
    this.options.emitter.emit(result);
  }

}
