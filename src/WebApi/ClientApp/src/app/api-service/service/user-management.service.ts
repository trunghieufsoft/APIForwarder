import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ApiHttpClient } from "src/app/shared/common/api-http-client";
import {
  EmployeeDto,
  AllUser,
  ManagerDto,
  StaffDto
} from "../model/user-management-dto";
import { API } from "../api";
import { BaseService } from "src/app/base/base.service";

@Injectable({
  providedIn: "root"
})
export class UserService extends BaseService {
  constructor(private http: ApiHttpClient) {
    super();
  }

  public getAllUsers(): Observable<AllUser> {
    return this.http.get(API.user.totalUsers);
  }

  public createNewManager(data: ManagerDto): Observable<any> {
    return this.http.post(API.user.createManager, data);
  }
  public createNewStaff(data: StaffDto): Observable<any> {
    return this.http.post(API.user.createStaff, data);
  }

  public createNewEmployee(data: EmployeeDto): Observable<any> {
    return this.http.post(API.user.createEmployee, data);
  }
  public deleteUser(data: any): Observable<any> {
    return this.http.post(API.user.deleteUser, { id: data });
  }

  public viewUserByID(id: number): Observable<any> {
    return this.http.post(API.user.view, id);
  }

  public updateManager(data: any): Observable<any> {
    return this.http.post(API.user.updateManager, data);
  }

  public updateStaff(data: any): any {
    return this.http.post(API.user.updateStaff, data);
  }

  public updateEmployee(data: any): Observable<any> {
    return this.http.post(API.user.updateEmployee, data);
  }

  public assignUser(data: string): Observable<any> {
    return this.http.post(API.user.assignUser, { username: data });
  }
}
