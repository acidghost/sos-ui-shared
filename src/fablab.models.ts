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


export interface FablabReservation {
  id: number,
  machineId: number,
  user: UserShort,
  startTime: Date,
  endTime: Date,
  realizationOf: string,
  createdAt: Date
}


export namespace FablabReservation {

  export function fromJson(json: any): FablabReservation {
    return {
      id: json.id,
      machineId: json.machineId,
      user: json.user,
      startTime: new Date(json.startTime),
      endTime: new Date(json.endTime),
      realizationOf: json.realizationOf,
      createdAt: new Date(json.createdAt)
    };
  }

}
