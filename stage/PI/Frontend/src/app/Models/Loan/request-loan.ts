import { Amortization } from "./amortization";

export class RequestLoan {
    requestId!: number;
    reqDate!: Date;
    loanAmnt!: number;
    nbrMonth!: number;
    nbrYears!: number;
    garantorFile!: ArrayBuffer;
    fileName!: string;
    status!: StatLoan;
    typeAmrt!: typeAmort;
    //offerLoan!: OfferLoan;
    amortization!: Amortization[];
}

enum typeAmort {
    CONST_ANNUITY = "CONST_ANNUITY",
    CONST_AMORTIZATION = "CONST_AMORTIZATION",
    LOAN_PER_BLOC = "LOAN_PER_BLOC",
    CONST_MONTHLY = "CONST_MONTHLY"
  }
  
  enum StatLoan {
    PENDING ="PENDING",    
    APPROVED = "APPROVED",
    REJECTED = "REJECTED"
  }
