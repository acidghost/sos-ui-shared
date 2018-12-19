import {ApiService} from "./api.service";
import {Injectable} from "@angular/core";
import {AuthService} from "./auth.service";
import {Environment} from "./shared";
import {Http} from "@angular/http";
import {Observable} from "rxjs/Observable";
import {FablabMachine, FablabQuotation, FablabQuotationRequest, FablabReservation} from "./fablab.models";


@Injectable()
export class FablabService extends ApiService {

  constructor(protected http: Http, authService: AuthService, environment: Environment) {
    super(authService, environment);
  }

  public allMachines(): Observable<FablabMachine[]> {
    return this.http.get(`${this.backendUrl}/fablab/machines`, this.options)
      .map(response => response.json().machines);
  }

  public findMachine(id: number): Observable<FablabMachine> {
    return this.http.get(`${this.backendUrl}/fablab/machines/${id}`, this.options)
      .map(response => response.json());
  }


  private getReservations(url: string): Observable<FablabReservation[]> {
    return this.http.get(url, this.options)
      .map(response => response.json().reservations.map(FablabReservation.fromJson));
  }

  public allReservations(future: boolean = false): Observable<FablabReservation[]> {
    let qs = future ? '?future=true' : '';
    return this.getReservations(`${this.backendUrl}/fablab/reservations${qs}`);
  }

  public machineReservations(machineId: number, future: boolean = false): Observable<FablabReservation[]> {
    let qs = future ? '?future=true' : '';
    return this.getReservations(`${this.backendUrl}/fablab/machines/${machineId}/reservations${qs}`);
  }

  public userReservations(future: boolean = false): Observable<FablabReservation[]> {
    let qs = future ? '?future=true' : '';
    return this.getReservations(`${this.backendUrl}/fablab/my_reservations${qs}`);
  }

  public createReservation(reservation: FablabReservation): Observable<FablabReservation> {
    let url = `${this.backendUrl}/fablab/machines/${reservation.machine.id}/reservations`;

    let payload = {
      times: reservation.times,
      operator: reservation.operator
    };

    return this.http.post(url, payload, this.options)
      .map(response => FablabReservation.fromJson(response.json()));
  }

  public deleteReservation(id: number): Observable<void> {
    return this.http.delete(`${this.backendUrl}/fablab/reservations/${id}`, this.options)
      .map(() => {});
  }

  public createQuotation(quotation: FablabQuotationRequest): Observable<FablabQuotation> {
    return this.http.post(`${this.backendUrl}/fablab/quotations`, quotation, this.options)
      .map(response => FablabQuotation.fromJson(response.json()));
  }

}
