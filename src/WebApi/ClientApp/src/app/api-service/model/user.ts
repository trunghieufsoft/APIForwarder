export interface User {
  data: IUser;
  success: boolean;
}
interface IUser {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  userType: string;
  countryId: string;
  createdBy: string;
  createdDate: string;
  status: string;
}
