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
