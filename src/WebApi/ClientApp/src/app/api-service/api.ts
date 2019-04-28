export const API = {
  user: {
    login: "User/WebLogin",
    logout: "User/Logout",
    totalUsers: "User/TotalUsers",
    getProfile: "User/GetProfile",
    changePassword: "User/ChangePassword",
    deleteUser: "User/Delete",
    view: "User/View/",
    resetPassword: "User/ResetPassword",
    keepAlive: "User/KeepAlive",
    createManager: "User/CreateManager",
    createStaff: "User/CreateStaff/",
    createEmployee: "User/CreateEmployee",
    updateManager: "User/UpdateManager",
    updateStaff: "User/UpdateStaff/",
    updateEmployee: "User/UpdateEmployee",
    listManager: "User/Search/ManagerAdmin",
    listStaff: "User/Search/Staff",
    listEmployee: "User/Search/Employee",
    assignUser: "User/AssignUsers"
  },
  common: {
    allCountry : "Common/GetAllCountry",
    allGroup : "Common/GetAllGroup",
    detailCountry: "Common/GetDetailCountry",
    getListAssignByType: "Common/GetListAssignByType"
  },
  system: {
    update: "SystemConfig/Update",
    getAll: "SystemConfig/GetAll",
    getByKey: "SystemConfig/GetByKey"
  },
  log: "AuditLog/Search"
};
