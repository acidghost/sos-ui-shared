import {UserContacts, UserShort} from "./shared";


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
  id: number
  userId: number
  realizationOf: string
  undertaken: boolean
  machines: SlimMachine[]
  createdAt: Date
  user?: UserContacts
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
      undertaken: json.undertaken,
      machines: json.machines,
      createdAt: new Date(json.createdAt),
      user: json.user
    };
  }
}


export interface FablabReservationTime {
  date: Date,
  hour: number
}


export interface FablabReservation {
  id: number,
  machine: SlimMachine,
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
      machine: json.machine,
      user: json.user,
      times: json.times.map(t => { return { date: new Date(t.date), hour: t.hour } }),
      startTime: new Date(json.startTime),
      endTime: new Date(json.endTime),
      operator: json.operator,
      createdAt: new Date(json.createdAt)
    };
  }

}
