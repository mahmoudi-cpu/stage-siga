
import { Event} from "../Event/event";


export class Shareholder {
    idShareholder !: number;
    lastNameShareholder !: string;
    firstNameShareholder !: string;
    investment !: number;
    email !: string;
    numTel !: number;
    partner !: TypeShareholder;
    event !: Event;
}

export enum TypeShareholder {
    SUPPLIER='Supplier',
    ASSOCIATION='Association',
     BANK='Bank'


}















/*export class  Hardware {
    hardwareID: number;
    hardwareName: string;
    status: HardwareStatus;
    quantity: number;
}

export enum HardwareStatus {
    Not_Available = 'Not_Available',
    Available = 'Available',
   
}*/
