import { Injectable } from "@angular/core";
import { ApiHttpClient } from "src/app/shared/common/api-http-client";
import { BaseService } from "src/app/base/base.service";
import { API } from "../api";

@Injectable({
  providedIn: "root"
})
export class CommonService extends BaseService {
  constructor(private http: ApiHttpClient) {
    super();
  }

  public allCountry(): any {
    return this.http.get(API.common.allCountry);
  }

  public allGroups(): any {
    return this.http.get(API.common.allGroup);
  }

  public getDetailCountry(): any {
    return this.http.get(API.common.detailCountry);
  }

  public getListAssignByType(): any {
    return this.http.get(API.common.getListAssignByType);
  }

  public getUsersAllTypeAssignByCountry({ userType = "", country = "" }: { userType?: string; country?: string; }): any {
    var url = API.common.getUsersAllTypeAssignByCountry;
    url += userType !== "" ? "?userType=" + userType : "";
    url += country !== "" ? userType !== "" ? "&country=" + country.toUpperCase() : "?country=" + country.toUpperCase() : "";
    return this.http.get(url);
  }
}
