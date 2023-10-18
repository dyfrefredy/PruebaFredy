import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService, ConfirmEventType, MessageService } from 'primeng/api';
import { User } from '../../../model/user';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';
import { environment, b2cPolicies } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { MsalService } from '@azure/msal-angular';
import { UserSetting } from '../../../model/user-setting';
import { StorageService } from '../../../services/storage.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  user: User;
  userB2c: any;
  existingExternalUser: boolean = false;
  existingExternalUserApproval: number = 0;
  userSetting: UserSetting

  constructor(
    private authService: AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private translateService: TranslateService, 
    private router: Router,
    private authMsalService: MsalService,
    private storageService: StorageService,
  ) {
    
  }

  ngOnInit() {
    this.userB2c= this.authService.getAccount();
    if(this.userB2c){
      this.validateUser();
    }

    this.userSetting = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE);
    this.userSetting.entryClaims = false;
    this.storageService.setSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE, JSON.stringify(this.userSetting));
    this.translateService.use(this.userSetting.lang); 
  }

  confirmation() {
    this.confirmationService.confirm({
      message: this.translateService.instant('module.directClaims.policies.message', "moduleName"),
      header: this.translateService.instant('module.directClaims.policies.header', "moduleName"),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

        this.messageService.add({ severity: 'info', summary: this.translateService.instant('module.directClaims.policies.summaryConfirmed', "moduleName"), detail: this.translateService.instant('module.directClaims.politics.confirmDetail', "moduleName") });
        this.router.navigate(['home/claimMenu']);
      },
      reject: (type) => {
        switch (type) {
          case ConfirmEventType.REJECT:
            this.messageService.add({ severity: 'error', summary: this.translateService.instant('module.directClaims.policies.summaryReject', "moduleName"), detail: this.translateService.instant('module.directClaims.politics.rejectDetail', "moduleName") });
            break;
          case ConfirmEventType.CANCEL:
            this.messageService.add({ severity: 'warn', summary: 'Cancelled', detail: 'You have cancelled' });
            break;
        }
      }
    });
  }

  validateUser() {

    this.transactionService.getAll(environment.customerServiceAPI, this.constantService.USER_URL + "/mail/" + this.userB2c.idToken.emails[0]).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.user = data.businessDto;
        } else {
          this.validateExternalUser();
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Consulta de usuario',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  validateExternalUserApproval() {
    this.transactionService.getAll(environment.customerServiceAPI, this.constantService.EXTERNAL_USER_APPROVAL_URL + "/mail/" + this.userB2c.idToken.emails[0]).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          if (data.businessDto[0].responseStatus) {
            this.existingExternalUserApproval = 1
          }
          else
          this.existingExternalUserApproval = 2;
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Consulta de usuario',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  validateExternalUser() {
    this.transactionService.getAll(environment.customerServiceAPI, this.constantService.EXTERNAL_USER_URL + "/mail/" + this.userB2c.idToken.emails[0]).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.existingExternalUser = true;
          this.validateExternalUserApproval();
        } else {
          this.router.navigate(['home/externalUser']);
        }
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Consulta de usuario',
          detail: 'Por favor, intente más tarde.',
        });
      }
    );
  }

  login(){
    this.authMsalService.loginPopup();
  }
}
