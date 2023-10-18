import { City } from "./city";

export class Consignee {
    id : number;
    name:String;
    address : String;
    zipCode : String;
    telephoneNumber : String;
    email : String;
    userId : number;
    cityId : number;
    active: boolean;
    city:City;
    }
    