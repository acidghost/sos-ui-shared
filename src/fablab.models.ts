import {UserShort} from "./shared";


export interface FablabMachine {
  id: number,
  name: string,
  workArea?: string,
  maxHeight?: string,
  cutsMetal?: boolean,
  cutsMaterials?: string,
  engravesMetal?: boolean,
  engravesMaterials?: string,
  priceHour: number,
  operator: boolean
}


export interface FablabReservationTime {
  date: Date,
  hour: number
}


export interface FablabReservation {
  id: number,
  machineId: number,
  user: UserShort,
  times: FablabReservationTime[],
  startTime: Date,
  endTime: Date,
  realizationOf: string,
  operator: boolean,
  createdAt: Date
}


export namespace FablabReservation {

  export function fromJson(json: any): FablabReservation {
    return {
      id: json.id,
      machineId: json.machineId,
      user: json.user,
      times: json.times.map(t => { return { date: new Date(t.date), hour: t.hour } }),
      startTime: new Date(json.startTime),
      endTime: new Date(json.endTime),
      realizationOf: json.realizationOf,
      operator: json.operator,
      createdAt: new Date(json.createdAt)
    };
  }

}
