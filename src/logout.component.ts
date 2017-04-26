import {Component, Input} from "@angular/core";
import {AuthService} from "./auth.service";


@Component({
  selector: 'sos-logout',
  template: `
    <form name="logout-form" class="hidden-sm-up" method="post" [action]="logoutUrl"></form>
    <button *ngIf="useBtn" [class]="classes" (click)="doLogout($event)">Logout</button>
    <a *ngIf="!useBtn" [class]="classes" (click)="doLogout($event)" href="#">Logout</a>
  `
})
export class LogoutComponent {

  @Input() classes: string;
  @Input() useBtn: boolean;
  public logoutUrl: string;

  constructor(private authService: AuthService) {
    this.logoutUrl = authService.logoutUrl;
  }

  doLogout(event: Event) {
    event.preventDefault();
    this.authService.removeToken();
    document.forms['logout-form'].submit();
  }

}
