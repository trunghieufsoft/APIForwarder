import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig } from '../services/app.config.service';

@Injectable({ providedIn: 'root' })
export class ApiHttpClient {
  private readonly baseUrl: string;
  constructor(private http: HttpClient, @Inject('BASE_URL') baseUrl: string) {
    this.baseUrl = baseUrl;
  }
  public replacer: any = function(key: any, value: any): any {
    if (this[key] instanceof Date) {
      const date = this[key].getDate();
      const month = this[key].getMonth();
      const year = this[key].getFullYear();
      const hour = this[key].getHours();
      const min = this[key].getMinutes();

      return new Date(Date.UTC(year, month, date, hour, min, 0)).toUTCString();
    }

    return value;
  };
  public get(url: string, options?: any): Observable<any> {
    return this.http.get(this.createRequestUrl(url), options);
  }

  public post(url: string, data: any, options?: any): Observable<any> {
    return this.http.post(
      this.createRequestUrl(url),
      JSON.stringify(data, this.replacer),
      options
    );
  }

  public put(url: string, data: any, options?: any): Observable<any> {
    return this.http.put(
      this.createRequestUrl(url),
      JSON.stringify(data),
      options
    );
  }

  public delete(url: string, options?: any): Observable<any> {
    return this.http.delete(this.createRequestUrl(url), options);
  }

  public createRequestUrl(url: string): string {
    return AppConfig.settings.apiUrl + url;
    // return `${this.baseUrl}api/${url}`;
  }
}
