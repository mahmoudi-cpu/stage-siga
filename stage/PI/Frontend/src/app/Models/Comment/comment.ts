import { Publication } from "../Blog/publication";
import { User } from "../user/user";

export class Comment {
    idcmt?: number;
    contenu?: string;
    dateCreation?: Date;
    user?:User;
    publication?: Publication;
    sentiment?: string;
}
