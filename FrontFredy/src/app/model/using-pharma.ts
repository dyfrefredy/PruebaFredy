import { Container } from './container';
import { PackagingPassive } from './packaging-passive';

export class UsingPharma {
    id: Number;
    quotationId: Number;
    bookingId: Number;
    dangerousGoodsCode: Number;
    temperatureControl: String;
    packagingTypeAnswer: String;

    packagingPassive: PackagingPassive;
    containers: Container[];
}
