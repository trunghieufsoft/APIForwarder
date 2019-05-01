export interface User {
  data: IUser;
  success: boolean;
}
interface IUser {
  id: string,
  code: string,
  username: string,
  fullName: string,
  countryId: string,
  groups: string,
  groupName: string,
  users: string,
  userType: string,
  status: number,
  statusStr: string,
  startDate: string,
  expiredDate: string,
  expiredIn: string,
  address: string,
  phoneNo: string,
  email: string,
  initializeInfo: {
    createdBy: string,
    createdDate: Date,
    lasUpdatedBy: string,
    lasUpdatedDate: Date,
    passwordLastUpdate: Date
  }
}
