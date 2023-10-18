import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadTypeService {
  public perishable: Number = 4;
  public liveAnimals: Number = 5;
  public pharmaceutical: Number = 6;
}
