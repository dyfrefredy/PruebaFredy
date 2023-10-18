import { ConstantService } from './../constant/constant-service';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FilterQuery } from '../model/filter-query';


@Injectable({
  providedIn: 'root'
})

export class TransactionService {
  headers = new HttpHeaders();
  params = new HttpParams();

  constructor(private httpClient: HttpClient, private constantService: ConstantService) {
    this.headers = this.headers.append('Content-Type', 'application/json');
    this.headers = this.headers.append('Accept', 'application/json');
    this.headers = this.headers.append('Authorization', 'Bearer ' + localStorage.getItem("msal.idtoken"));
  }

  public save(apiUrl: string, urlService: string, data?: any): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}` + `${urlService}`, data, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  public update(apiUrl: string, urlService: string, data?: any): Observable<any> {
    return this.httpClient.put<any>(`${apiUrl}` + `${urlService}`, data, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  public delete(apiUrl: string, urlService: string, ids?: string[]): Observable<any> {
    let options = {
      headers: this.headers,
      body: JSON.stringify(ids)
    };

    //this.params = this.params.append('id', ids[0]);
    //let httpParams  = new HttpParams();
    //httpParams  = httpParams .append('id', ids[0]);
    //return this.httpClient.delete<any>(`${apiUrl}` + `${urlService}`,   { params: httpParams }).pipe(map(res => {
    return this.httpClient.delete<any>(`${apiUrl}` + `${urlService}`, options).pipe(map(res => {
      return res;
    }));
  }

  public getAll(apiUrl: string, urlService: string): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}` + `${urlService}`, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  public getPaginationAndFilter(apiUrl: string, urlService: string, filter?: FilterQuery): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}` + `${urlService}` + this.constantService.FILTER_URL, filter, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  public fetchClaim(apiUrl: string, urlService: string, filter?: FilterQuery): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}` + `${urlService}` + this.constantService.FETCH_CLAIM_URL, filter, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  public saveClaim(apiUrl: string, urlService: string, data?: any): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}` + `${urlService}` + this.constantService.SAVE_CLAIM_URL, data, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }


  public getPaginationAndFilterActives(apiUrl: string, urlService: string, filter?: FilterQuery): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}` + `${urlService}` + this.constantService.FILTER_ACTIVES_URL, filter, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  public GetPaginationAndFilterAsignment(apiUrl: string, urlService: string, filter?: FilterQuery): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}` + `${urlService}` + this.constantService.FILTER_ASIGNMENT_URL, filter, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }



  public GetList(apiUrl: string, urlService: string, urlParameter: String): Observable<any> {
    return this.httpClient.get<any>(`${apiUrl}` + `${urlService}` + `${urlParameter}`, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }

  public get(apiUrl: string, urlService: string, id?: any): Observable<any> {
    let httpParams = new HttpParams();
    httpParams = httpParams.append('id', id);
    return this.httpClient.get<any>(`${apiUrl}` + `${urlService}`, { headers: this.headers, params: httpParams }).pipe(map(res => {
      return res;
    }));
  }


  public getReport(apiUrl: string, urlService: string, reportURL: string, filter?: FilterQuery): Observable<any> {
    return this.httpClient.post<any>(`${apiUrl}` + `${urlService}` + reportURL, filter, { headers: this.headers }).pipe(map(res => {
      return res;
    }));
  }


}
