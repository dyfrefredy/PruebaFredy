import {Component, OnInit} from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { ConfirmationService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { ConstantService } from '../../constant/constant-service';
import { User } from '../../model/user';
import { UserSetting } from '../../model/user-setting';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { TransactionService } from '../../services/transaction.service';
import { navItems } from '../../_nav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './admin-layout.component.html'
})

export class AdminLayoutComponent implements OnInit{
  public sidebarMinimized = false;
  public navItems = [];
  user: User;
  userSetting:UserSetting
  countPharma:0;
  welcome:String;
  lblgLogin:String;
  lblLogout:String;
  languages:Array<{ name: string; value: string }>;

  previousLanguage: string;
  lblLanguage: String;


  constructor(
    public authService: AuthService,
    private transactionService: TransactionService,
    private constantService: ConstantService,
	  private translateService: TranslateService,
    private storageService: StorageService,
    private confirmationService: ConfirmationService ) {
    this.languages =[];
    for (let index = 0; index < this.constantService.LANGUAGE.length; index++) {
      this.languages.push({name: this.translateService.instant(this.constantService.LANGUAGE[index].name), value: this.constantService.LANGUAGE[index].value });
    }

    this.userSetting = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE);
    if(this.userSetting != null && this.userSetting.lang != null)
    {
      if(this.userSetting.lang == "es"){
         this.userSetting.lang ="en"
      }
      else{
        this.userSetting.lang ="es"
      }
    }
    else{
      this.userSetting = new UserSetting();
      this.userSetting.lang = 'en';
      this.storageService.setSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE, JSON.stringify(this.userSetting));
      this.translateService.use(this.userSetting.lang);
    }

    this.lblLanguage = this.languages.find(x => x.value == this.userSetting.lang).name;

    this.authService.checkAccount();

    if(this.authService.loggedIn){
      var authUser = this.authService.getAccount();
      this.getUser(authUser.idToken.emails[0]);
      // this.getCountPharma(authUser.idToken.emails[0]);
    }
  }

  ngOnInit() {
	this.user = this.authService.currentUserValue;
    this.userSetting = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE);
    if(this.userSetting == null){
      this.userSetting = new UserSetting();
      this.userSetting.lang = 'en';
      this.storageService.setSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE, JSON.stringify(this.userSetting));
      this.translateService.use(this.userSetting.lang);
    }else{
      this.translateService.use(this.userSetting.lang);
    }

    this.previousLanguage = this.userSetting.lang;

    this.welcome = this.translateService.instant('module.login.welcome', "welcome");
    this.lblgLogin = this.translateService.instant('module.login.login', "login");
    this.lblLogout = this.translateService.instant('module.login.logout', "logout");
  }

  switchLang(lang: string) {
    if(lang == "es"){
      lang ="en"
    }
    else{
      lang ="es"
    }

    this.confirmationService.confirm({
      message: this.translateService.instant('module.defaultLayout.languageChangeQuestion', "languageChangeQuestion"),
      header: this.translateService.instant('module.defaultLayout.informationLossAlert', "informationLossAlert"),
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.lblLanguage = this.languages.find(x => x.value == lang).name
        this.userSetting.lang = lang;
        this.storageService.setSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE, JSON.stringify(this.userSetting));
        this.translateService.use(lang);
        window.location.reload();
      },
      reject: () => {
        this.previousLanguage = this.userSetting.lang;
      },
    });
  }

  getMenu(rolId: Number) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.MENU_URL, '/' + rolId ).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.navItems = data.businessDto;
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  getUser(mail: string) {
    this.transactionService.getAll(environment.adminAPI, this.constantService.USER_URL+'/mail/'+mail).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          if (data.businessDto != null) {
            this.getMenu(data.businessDto[0].roleId);
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

  toggleMinimize(e) {
    this.sidebarMinimized = e;
  }

getCountPharma(mail: string){
    this.transactionService.getAll(environment.pharmaAPI,`${this.constantService.WAYBILL_RPA_URL}/GetCountPharma/` + mail).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK)
          this.countPharma = data.totalRecords;
         else
          this.countPharma = 0;

      },
      (error) => {
        this.countPharma = 0;
      }
    );
  }

  logout(){
    this.authService.logout();
  }
}
