export const rolePermissions = {
  admin: [
    "viewPatients",
    "editPatients",
    "deletePatients",
    "viewAccounts",
    "editAccounts",
    "manageEmployees",
    "manageDepartments",
  ],
  doctor: ["viewPatients", "editPatients"],
  receptionist: ["viewPatients"],
  accountant: ["viewAccounts", "editAccounts"],
  employee: [],
};
