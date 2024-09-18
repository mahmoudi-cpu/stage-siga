import { RequestLoan } from './request-loan';
import { User } from '../user/user';


export enum LoanType {
  STUDENT = "STUDENT",
  FARMER = "FARMER",
  HOMEMAKER = "HOMEMAKER",
  PROJECT = "PROJECT"
}
export class OfferLoan {
  idOffer!: number;
  status!: string;
  typeLoan!: LoanType;
  offrDate!: Date;
  maxAmnt!: number;
  minAmnt!: number;
  minRepaymentPer!: number;
  tmm!: number;
  intRate!: number;
  user!: User;
}

 // requestLoans!: RequestLoan[];


