import {UserShort} from "./shared";


export interface SlimMachine {
  id: number,
  name: string
}

export interface FablabMachine extends SlimMachine {
  workArea?: string,
  maxHeight?: string,
  cutsMetal?: boolean,
  cutsNonMetal?: boolean,
  cutsMaterials?: string,
  engravesMetal?: boolean,
  engravesNonMetal?: boolean,
  engravesMaterials?: string,
  priceHour: number,
  operator: boolean,
  operatorCost?: number
}


export interface FablabQuotation {
  id: number,
  userId: number,
  realizationOf: string,
  machines: SlimMachine[],
  createdAt: Date
}

export interface FablabQuotationRequest {
  realizationOf: string,
  machines: SlimMachine[]
}

export namespace FablabQuotation {
  export function fromJson(json: any): FablabQuotation {
    return {
      id: json.id,
      userId: json.userId,
      realizationOf: json.realizationOf,
      machines: json.machines,
      createdAt: new Date(json.createdAt)
    };
  }
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
      operator: json.operator,
      createdAt: new Date(json.createdAt)
    };
  }

}
