const Endpoints = {
  //BASE_URL: "https://jeeneapi.rhenoxinnovations.com/api",
  BASE_URL: "https://localhost:44348/api",

  //Authentication
  SIGN_IN: "/Authentication/Login",

  //Categories
  GET_CATEGORIES: "/Category/GetAll",
  CREATE_CATEGORIES: "/Category/Create",
  UPDATE_CATEGORIES: "/Category/Update",
  DELETE_CATEGORIES: "/Category/Delete",

  //SubCategories
  GET_SUB_CATEGORIES: "/SubCategory/GetAll",
  CREATE_SUB_CATEGORIES: "/SubCategory/Create",
  UPDATE_SUB_CATEGORIES: "/SubCategory/Update",
  DELETE_SUB_CATEGORIES: "/SubCategory/Delete",

  //User
  EDIT_USER_PROFILE: "/User/EditUserProfile",
  GET_USER_DETAILS: "/User/GetUserDetails",
  GET_ALL_USER_DETAILS: "/User/GetAllUserDetails",
  GET_ALL_USERS: "/User/GetAll",
  DELETE_USER: "/User/Delete",
  CREATE_USER: "/User/Create",
  CHANGE_PASSWORD: "/User/ChangePassword",
  ACTIVATE_USER: "/User/ActivateUser",
  DEACTIVATE_USER: "/User/DeactivateUser",
  EDIT_USER_ROLE: "/User/EditUserRoles",

  //Roles
  GET_ROLES: "/Role/GetAll",
  GET_ROLE_BY_ID: "/Role",
  GET_ROLE_PERMISSIONS: "/Role/GetRolePermissions",
  CREATE_ROLE: "/Role/Create",
  UPDATE_ROLE: "/Role/Edit",
  DELETE_ROLE: "/Role/Delete",

  //File Upload
  UPLOAD_FILE: "/File/Upload",

  //Reviews
  GET_ALL_REVIEWS: "/Review/GetAll",
  UPDATE_REVIEW_STATUS: "/Review/UpdateStatus",
  UPDATE_REVIEW: "/Review/Update",
  DELETE_REVIEW: "/Review/Delete",
  REVIEW_BY_ID: "/Review/GetById",

  //Rating Parameters
  GET_ALL_RATING_PARAMETERS: "/RatingParameter/GetAll",
  CREATE_RATING_PARAMETER:  "/RatingParameter/Create",
  UPDATE_RATING_PARAMETER:  "/RatingParameter/Update",
  DELETE_RATING_PARAMETER:  "/RatingParameter/Delete",
  GET_RATING_PARAMETER_BY_CATEGORY: "/RatingParameter/GetByCategoryId"
};

export { Endpoints };
