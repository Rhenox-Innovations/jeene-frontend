const Endpoints = {
  //BASE_URL: "https://jeeneapi.rhenoxinnovations.com/api",
  BASE_URL: "https://localhost:44348/api",
  //Authentication
  SIGN_IN: "/Authentication/Login",

  //Categories
  GET_CATEGORIES: "/Category/GetAll",

  //User
  EDIT_USER_PROFILE: "/User/EditUserProfile",
  GET_USER_DETAILS: "/User/GetUserDetails",
  GET_ALL_USER_DETAILS: "/User/GetAllUserDetails",
  GET_ALL_USERS: "/User/GetAll",
  DELETE_USER: "/User/Delete",
  CREATE_USER: "/User/Create",
  //Roles
  GET_ROLES: "/Role/GetAll",

  //File Upload
  UPLOAD_FILE: "/File/Upload"
};

export { Endpoints };
