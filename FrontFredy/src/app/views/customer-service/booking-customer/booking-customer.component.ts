import { Component, OnInit } from '@angular/core';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-booking-customer',
  templateUrl: './booking-customer.component.html',
  styleUrls: ['./booking-customer.component.scss']
})
export class BookingCustomerComponent implements OnInit {

  user: User;
  constructor(private authService: AuthService) { 
    this.user = this.authService.currentUserValue;
  }

  ngOnInit(): void {
  }

}
