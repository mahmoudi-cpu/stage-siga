import { User } from "../user/user";
import { EventStatus } from "./EventStatus";
import { TypeEvent } from "./TypeEvent";
import { Shareholder } from "../Shareholder/shareholder";



export class Event{

    idEvent !: number;
  nameEvent!: string;
  descriptionEvent!: string;
  domain!: string;
  dateEvent!: Date;
  likes!: number;
  dislikes!: number;
  investNeeded!: number;
  type!: TypeEvent;
  shareholders?: Shareholder[];
  userSet?: User[];
  eventStatus!: EventStatus;
  
  
}


