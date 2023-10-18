import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  getSessionStorageItem(key: string): any {
    if (window.sessionStorage.getItem(key) != null) {
      let data = atob(window.sessionStorage.getItem(key));
      return JSON.parse(data);
    }
    return null;
  }

  setSessionStorageItem(key: string, data: string): void {
    window.sessionStorage.setItem(key, btoa(data));
  }

  removeSessionStorageItem(key: string): void {
    window.sessionStorage.removeItem(key);
  }
}