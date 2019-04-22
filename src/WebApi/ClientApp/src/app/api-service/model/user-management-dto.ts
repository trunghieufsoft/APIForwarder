export interface UserByIDDto {
  id: number;
}

// start Dto Manager
export interface ManagerDto {
  countryId: string,
  fullName: string,
  username: string,
  password: string,
  groups: string,
  address: string,
  phoneNo: string,
  email: string,
  startDate: Date,
  expiredDate: Date
}
// end Dto Manager

// start Dto Staff
export interface StaffDto {
  countryId: string,
  fullName: string,
  username: string,
  password: string,
  group: string,
  address: string,
  phoneNo: string,
  email: string,
  startDate: Date,
  expiredDate: Date
}

// end Dto Staff

// start Dto Employee
export interface EmployeeDto {
  countryId: string,
  fullName: string,
  username: string,
  password: string,
  group: string,
  address: string,
  phoneNo: string,
  email: string,
  startDate: Date,
  expiredDate: Date
}
// end Dto Employee

export interface AllUser {
  data: {
    manager: number;
    staff: number;
    employee: number;
  };
}
