import { Component, OnInit } from '@angular/core';
import { ConstantService } from '../../../constant/constant-service';
import { UserSetting } from '../../../model/user-setting';
import { StorageService } from '../../../services/storage.service';
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: 'app-claim-menu',
  templateUrl: './claim-menu.component.html',
  styleUrls: ['./claim-menu.component.css']
})
export class ClaimMenuComponent implements OnInit {
  userSetting: UserSetting

  constructor(
    private constantService: ConstantService,
    private storageService: StorageService,
    private translateService: TranslateService
  ) { 
    this.userSetting = this.storageService.getSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE);
    
    if (this.userSetting.lang != "es" && this.userSetting.entryClaims == false) {
      this.userSetting.lang = 'es';
      this.userSetting.entryClaims = true;
      this.storageService.setSessionStorageItem(this.constantService.SESSION_STORAGE_LANGUAJE, JSON.stringify(this.userSetting));
      this.translateService.use(this.userSetting.lang); 
    }
  }

  ngOnInit(): void {
  }

}
