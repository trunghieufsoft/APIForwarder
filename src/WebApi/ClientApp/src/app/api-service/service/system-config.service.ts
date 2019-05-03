import { Injectable } from "@angular/core";
import { BaseService } from "src/app/base/base.service";
import { ApiHttpClient } from "src/app/shared/common/api-http-client";
import { API } from "../api";

@Injectable({
  providedIn: "root"
})
export class SystemConfigService extends BaseService {
  constructor(private http: ApiHttpClient) {
    super();
  }

  public getAll(): any {
    return this.http.get(API.system.getAll);
  }

  public getByKey(params: string): any {
    return this.http.post(API.system.getByKey, params);
  }

  public update(params: any): any {
    return this.http.post(API.system.update, params);
  }
}
