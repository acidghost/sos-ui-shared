import {Component, Input} from "@angular/core";
import {AuthService} from "./auth.service";


@Component({
  selector: 'sos-logout',
  template: `
    <form name="logout-form" class="hidden-sm-up" method="post" [action]="logoutUrl"></form>
    <button [class]="btnClasses" (click)="doLogout()">Logout</button>
  `
})
export class LogoutComponent {

  @Input() btnClasses: string;
  public logoutUrl: string;

  constructor(private authService: AuthService) {
    this.logoutUrl = authService.logoutUrl;
  }

  doLogout() {
    this.authService.removeToken();
    document.forms['logout-form'].submit();
  }

}
