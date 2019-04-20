import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class BaseService {
  public errMsg: string;
  constructor() {}

  public extractData(res: Response): any {
    const body = res.json();

    return body || {};
  }

  public getConvertToken(): any {
    if (this.isAuthenticated()) {
      const getToken = this.getToken();

      return this.decodeToken(getToken);
    }

    return '';
  }

  public clearData(): void {
    localStorage.clear();
  }

  public setToken(data: any): void {
    localStorage.setItem('access_token', data);
  }

  public getToken(): string {
    if (this.isAuthenticated) {
      return localStorage.getItem('access_token');
    }

    return '';
  }

  public getCurrentUser(): any {
    return this.decodeToken(this.getToken());
  }

  public getFullName(): any {
    const value = this.getCurrentUser().Fullname;

    return (value && value.length > 20) ? value.substring(0, 15) + '...' : value;
  }

  public isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  public decodeToken(token: string = ''): any {
    if (token === null || token === '') {
      return { upn: '' };
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('JWT must have 3 parts');
    }
    const decoded = this.urlBase64Decode(parts[1]);
    if (!decoded) {
      throw new Error('Cannot decode the token');
    }

    return JSON.parse(decoded);
  }

  private urlBase64Decode(str: string): any {
    let output = str.replace(/-/g, '+').replace(/_/g, '/');
    switch (output.length % 4) {
      case 0:
        break;
      case 2:
        output += '==';
        break;
      case 3:
        output += '=';
        break;
      default:
        throw new Error('Illegal base64url string!');
    }

    return decodeURIComponent((window as any).escape(window.atob(output)));
  }
}
