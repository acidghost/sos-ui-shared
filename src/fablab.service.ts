import {ApiService} from "./api.service";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Environment} from "./shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {FablabMachine, FablabReservation} from "./fablab.models";


@Injectable()
export class FablabService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public allMachines(): Observable<FablabMachine[]> {
    return this.http.get(`${this.backendUrl}/fablab/machines`, this.options)
      .map(response => response.json().machines)
      .catch(e => this.catchAuth(e));
  }

  public findMachine(id: number): Observable<FablabMachine> {
    return this.http.get(`${this.backendUrl}/fablab/machines/${id}`, this.options)
      .map(response => response.json())
      .catch(e => this.catchAuth(e));
  }


  private getReservations(url: string): Observable<FablabReservation[]> {
    return this.http.get(url, this.options)
      .map(response => response.json().reservations.map(FablabReservation.fromJson))
      .catch(e => this.catchAuth(e));
  }

  public allReservations(): Observable<FablabReservation[]> {
    return this.getReservations(`${this.backendUrl}/fablab/reservations`);
  }

  public machineReservations(machineId: number): Observable<FablabReservation[]> {
    return this.getReservations(`${this.backendUrl}/fablab/machines/${machineId}/reservations`);
  }

  public userReservations(): Observable<FablabReservation[]> {
    return this.getReservations(`${this.backendUrl}/fablab/my_reservations`);
  }

  public createReservation(reservation: FablabReservation): Observable<FablabReservation> {
    let url = `${this.backendUrl}/fablab/machines/${reservation.machineId}/reservations`;

    let payload = {
      times: reservation.times,
      realizationOf: reservation.realizationOf
    };

    return this.http.post(url, payload, this.options)
      .map(response => FablabReservation.fromJson(response.json()))
      .catch(e => this.catchAuth(e));
  }

  public deleteReservation(id: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/fablab/reservations/${id}`, this.options)
      .map(() => {})
      .catch(e => this.catchAuth(e));
  }

}
