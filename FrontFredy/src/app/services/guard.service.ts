import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { of, Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({
	providedIn: 'root'
})
export class GuardService implements CanActivate {
	constructor(
		public authService: AuthService
	) { }


	canActivate(): Observable<boolean> {
		
		// Temporary to display the token		
		this.authService.checkAccount();
		if (this.authService.loggedIn) { //this.authService.authenticated
			//TODO: Si se carga el usuario desde desde la respuesta del signIn no es necesario hacer esta llamada ya que al obtener el usuario se obtiene el token
			// console.log("En can activate llamo a get access token");
			// let token = this.authService.getAccessToken();
			return of(true);
		}else{
			this.authService.login();
		}
	}	
}
