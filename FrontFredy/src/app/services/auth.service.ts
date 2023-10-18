import { Injectable, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { BroadcastService, MsalService} from '@azure/msal-angular';
import { Logger, CryptoUtils } from 'msal';
import { isIE, b2cPolicies, environment } from '../../environments/environment';
import { User } from '../model/user';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { ConstantService } from '../constant/constant-service';
import { TransactionService } from './transaction.service';

@Injectable({
	providedIn: 'root'
})

export class AuthService {
  subscriptions: Subscription[] = [];
  isIframe = false;
  loggedIn = false;

  private currentUserSubject: BehaviorSubject<User>;
  public currentUser:Observable<User>;
  public requestUser : User;

  constructor(private authService: MsalService, private transactionService: TransactionService, private constantService: ConstantService, private storageService: StorageService ) {
    const data = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_USER);
    this.currentUserSubject = new BehaviorSubject<User>(data);
    if(data != null){
      this.currentUser = this.currentUserSubject.asObservable();
    }
  }

  public get currentUserValue(): User {
    return this.currentUserSubject ? this.currentUserSubject.value : null;
  }

  checkAccount() {
    let user = this.authService.getAccount();
    this.loggedIn = !!user;
    if(this.loggedIn){
      this.authorization(user.idToken.emails[0]);
    }
  }

  getAccount() {
    return this.authService.getAccount();
  }

  login() {
    if (isIE) {
      this.authService.loginRedirect();
    } else {
      this.authService.loginPopup();
    }
  }

  authorization(mail:String){
    this.transactionService.getAll(environment.adminAPI, this.constantService.USER_URL+'/mail/'+mail).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.requestUser = data.businessDto[0];
          this.storageService.setSessionStorageItem(this.constantService.SESSION_STORAGE_USER, JSON.stringify(this.requestUser));
        }
        this.currentUserSubject.next(this.requestUser);
        this.currentUser = this.currentUserSubject.asObservable();
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }


  logout() {
    sessionStorage.removeItem(this.constantService.SESSION_STORAGE_USER);
    this.currentUserSubject.next(null);
    this.authService.logout();
  }

  editProfile() {
    if (isIE) {
       this.authService.loginRedirect(b2cPolicies.authorities.editProfile);
    } else {
      this.authService.loginPopup(b2cPolicies.authorities.editProfile);
    }
  }
}
