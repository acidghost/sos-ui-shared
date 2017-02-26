import {AuthService} from "./auth.service";
import {ApiService} from "./api.service";


export abstract class ApiResolver {

  constructor(protected authService: AuthService, apiService: ApiService) {
    if (!authService.catchToken()) {
      authService.implicitFlow();
    }

    apiService.setToken(authService.accessToken);
  }

}
