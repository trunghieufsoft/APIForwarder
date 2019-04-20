import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';

import { IAppConfig } from '../model/app-config';

@Injectable()
export class AppConfig {
  public static settings: IAppConfig;

  constructor(private http: Http) {}

  public load(): Promise<void> {
    const jsonFile = `assets/config/config.json`;

    return new Promise<void>((resolve, reject) => {
      this.http
        .get(jsonFile)
        .toPromise()
        .then((response: Response) => {
          AppConfig.settings = response.json() as IAppConfig;
          resolve();
        })
        .catch((response: any) => {
          reject(`Could not load file '${jsonFile}': ${JSON.stringify(response)}`);
        });
    });
  }
}
