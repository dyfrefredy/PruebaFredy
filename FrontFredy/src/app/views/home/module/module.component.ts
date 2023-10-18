import { Component, OnInit } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ConstantService } from '../../../constant/constant-service';
import { Module } from '../../../model/module';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';

@Component({
  selector: 'app-module',
  templateUrl: './module.component.html',
  styleUrls: ['./module.component.css']
})
export class ModuleComponent implements OnInit {
  user: any;
  modules: Module[];
  notFound: boolean = true;
  listImagen:[{name:String,nameImage:String,extension:String}];
  constructor(public authService: AuthService, private transactionService: TransactionService, private constantService: ConstantService) { }

  ngOnInit(): void {
    this.listImagen = [{name:'',nameImage:'',extension:''}];
    this.listImagen.push({name:"default",nameImage:'default',extension:'.png'},{name:"pharma",nameImage:'pharma',extension:".svg"},{name:"Customs Border Protection",nameImage:'CBP',extension:".png"});
    this.user = this.authService.getAccount();
    if(this.user != null){
      this.getUser(this.user.idToken.emails[0]);
      this.notFound = false;
    }else{
      this.notFound = true;
    }
  }


  getModule(rolId: Number) {
    this.transactionService.GetList(environment.adminAPI, this.constantService.ROLE_MODULE_URL, '/FatherModule/' + rolId ).subscribe(
      (data) => {
        if (data.responseDto.response === this.constantService.RESPONSE_OK) {
          this.modules = data.businessDto;
          this.modules.forEach(md => {
            let image = this.listImagen.filter(val => val.name.toLowerCase() === md.name.toLowerCase());
            if(image.length > 0){
              md.imageName = image[0].nameImage +''+ image[0].extension;
            }
            else{
              md.imageName="default.png"
            }
          });
          if (this.modules.length > 0) {
            this.notFound = false;
          } else {
            this.notFound = true;
          }
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
            this.getModule(data.businessDto[0].roleId);
          }
        }
      },
      (error) => {
        console.log('Error: ' + error);
      }
    );
  }

}
