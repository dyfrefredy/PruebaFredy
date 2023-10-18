import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

export class CustomserServiceStatus {
  public confirmed: Number = 4;
  public cancelled: Number = 6;
}
