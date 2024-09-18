import { AmortizationDetail } from "./amortization-detail";

export class Amortization {
  idAmt!: number;
  date!: Date;
  periode!: number;
  startAmount!: number;
  intrest!: number;
  amrt!: number;
  annuity!: number;
  frais!: number;
  agio!: number;
  amtDetail!: AmortizationDetail[];

}
