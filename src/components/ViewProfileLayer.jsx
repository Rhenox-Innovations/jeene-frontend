import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { MultipleSelect } from "react-select-material-ui";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { updateUserData } from "../redux/actions/authSlice";
import { useLocation } from "react-router-dom";

const ViewProfileLayer = ({ page }) => {
  const { state } = useLocation();
  const { userData } = useSelector((state) => state.auth.user);
  const [imagePreview, setImagePreview] = useState(userData?.profilePicture);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [oldPasswprdVisible, setOldPasswordVisible] = useState(false);

  const [fullName, setFullName] = useState(userData?.fullName);
  const [email, setEmail] = useState(userData?.email);
  const [role, setRole] = useState(userData?.roles?.[0]);
  const [bio, setBio] = useState(userData?.fullName);
  const [interests, setInterests] = useState(userData?.interests);
  const [roleData, setRoleData] = useState([]);
  const [interestData, setInterestData] = useState([]);
  const [isActive, setIsActive] = useState(userData?.isActive);
  const [emailConfirmed, setEmailConfirmed] = useState(userData?.emailConfirmed);
  const [joiningDate, setjoiningDate] = useState(userData?.createdOn);
  const [deactivateReason, setDeactivateReason] = useState(userData?.deactivateReason);

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [userId, setUserId] = useState(userData?.id);
  const [showSuccess, setShowSuccess] = useState();
  const [showError, setShowError] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("")
  const [errors, setErrors] = useState({})

  const dispatch = useDispatch();

  useEffect(() => {
    checkUserProfile();
    getRoles();
    getInterests();
  }, []);

  // Toggle function for password field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggle function for confirm password field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };


  const toggleOldPasswordVisibility = () => {
    setOldPasswordVisible(!oldPasswprdVisible);
  };

  const checkUserProfile = async () => {
    if (state && state?.userId) {
      setPageLoading(true);
      const result = await apiRequest.get(
        `${Endpoints.GET_USER_DETAILS}/${state?.userId}`
      );
      if (result && result.data.success && result.data.data) {
        let userProfile = result.data.data;
        setFullName(userProfile.fullName);
        setEmail(userProfile.email);
        setUserId(userProfile.id);
        setImagePreview(userProfile.profilePicture);
        setBio(userProfile.bio);
        setInterests(userProfile.interests);
        setRole(userProfile.roles?.[0]);
        setIsActive(userProfile.isActive);
        setjoiningDate(userProfile.createdOn);
        setEmailConfirmed(userProfile.emailConfirmed);
        setDeactivateReason(userProfile.deactivateReason);
      }
      setPageLoading(false);
    }
  };

  const readURL = async (input) => {
    if (input.target.files && input.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(input.target.files[0]);

      const formData = new FormData();
      formData.append("file", input.target.files[0]);
      const response = await apiRequest.post(Endpoints.UPLOAD_FILE, formData, {
        headers: {
            "Content-Type": 'multipart/form-data'
        }
      });

      if(response?.status == 200 && response?.data.data.isSuccess){
        setImagePreview(Endpoints.BASE_URL.replace("api","") + response.data.data)
      }

     
    }
  };

  const getRoles = async () => {
    const result = await apiRequest.get(Endpoints.GET_ROLES);
    setRoleData(result?.data?.data);
  };

  const getInterests = async () => {
    const result = await apiRequest.get(Endpoints.GET_CATEGORIES);
    setInterestData(result?.data?.data);
  };

  const handleInterestChange = (values) => {
    setInterests([]);
    if (values?.length > 0) {
      setInterests(interestData?.filter((x) => values.includes(x.id)));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true);
    const requestData = {
      id: userId,
      fullName: fullName,
      bio: bio,
      profilePicture: imagePreview,
      interests: interests.map((x) => x.id),
    };

    try {
      var result = await apiRequest.put(
        Endpoints.EDIT_USER_PROFILE + "/" + userId,
        requestData
      );
      setLoading(false);
      if (result?.data?.success) {
        if (!state?.userId) {
          setLoading(true);
          result = await apiRequest.get(
            Endpoints.GET_USER_DETAILS + "/" + userId
          );
          setLoading(false);
          if (result?.data?.success && result?.data?.data) {
            dispatch(updateUserData(result?.data?.data));
          }
        }
        showSuccessMessage("User profile saved successfully!")
      }
    } catch (err) {
      setLoading(false);
    }
  };

  const handleCancel = async () => {
    setFullName(userData?.fullName);
    setEmail(userData?.email);
    setUserId(userData?.id);
    setImagePreview(userData?.profilePicture);
    setBio(userData?.bio);
    setInterests(userData?.interests);
    setRole(userData?.roles?.[0]);
  };

  const showSuccessMessage = (message) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(), 3000)
  }

  const validate = () => {
    setErrors({})
    var errorList = {}
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,25}$/
    
    if(!passwordRegex.test(password)){
        errorList = {...errorList, password: "Password must be 8 charachters long with at least single uppercase and lowercase alphabet, single number and single special character"}
    }

    if(password !== confirmPassword){
        errorList = {...errorList, confirmPassword: "Password and Confirm Password doesn't match!"}
    }

    if(!state?.userId && !oldPassword && oldPassword == ""){
        errorList = {...errorList, oldPassword: "Old Password is required!"}
    }

    setErrors(errorList)
    return Object.keys(errorList).length <= 0
  }

  const submitChangePassword = async () => {
    
    if(validate()){
        setLoading(true)
        let data = {
            newPassword: password,
            confirmPassword: confirmPassword,
            userId: userId
        }

        if(!state?.userId){
            data = {...data, currentPassword: oldPassword}
        }

        const result = await apiRequest.post(Endpoints.CHANGE_PASSWORD, data)
        setLoading(false)
        if(result?.status == 200 && result?.data?.success){
            showSuccessMessage("User password changed successfully!")
            setOldPassword("")
            setPassword("")
            setConfirmPassword("")
        }else{
            setShowError("Incorrect old password")
        }
    }
  }
  return (
    <div className="row gy-4">
      <div className="col-lg-4">
        <div className="user-grid-card position-relative border radius-16 overflow-hidden bg-base h-100">
         
          <div className="pb-24 ms-16 mb-24 me-16 mt-20">
            <div className="text-center border border-top-0 border-start-0 border-end-0">
              <img
                src={
                  imagePreview && imagePreview != ""
                    ? imagePreview
                    : "assets/images/user.png"
                }
                alt=""
                className="border br-white border-width-2-px w-100-px h-100-px rounded-circle object-fit-cover"
              />
              <h6 className="mb-0 mt-16">{!pageLoading && fullName}</h6>
              <span className="text-secondary-light mb-16">
                {!pageLoading && email}
              </span>
            </div>
            {pageLoading ? (
              <div className="d-flex justify-content-center">
                {" "}
                <ThreeDots
                  height="80"
                  width="80"
                  radius="5"
                  color="#487FFF"
                  ariaLabel="loading"
                  wrapperStyle={{ marginRight: 5 }}
                  wrapperClass=""
                  visible={pageLoading}
                />
              </div>
            ) : (
              <div className="mt-24 w-40">
                <h6 className="text-xl mb-16">Personal Info</h6>
                <ul>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      Full Name
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {fullName}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Email
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {email}
                    </span>
                  </li>

                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Role
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {role}
                    </span>
                  </li>

                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Bio
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {bio ? bio : "N/A"}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Interests
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {interests?.length > 0
                        ? interests?.map((x) => x.name).join(", ")
                        : "N/A"}
                    </span>
                  </li>
                  
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Joining Date
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {joiningDate ? new Date(joiningDate).toDateString() : "N/A"}
                    </span>
                  </li>   
                  {
                    !isActive &&
                    <li className="d-flex align-items-center gap-1 mb-12">
                      <span className="w-30 text-md fw-semibold text-primary-light">
                        {" "}
                        Block Reason
                      </span>
                      <span className="w-70 text-secondary-light fw-medium">
                        {deactivateReason}
                      </span>
                    </li>   
                  }
                </ul>
                <div className="d-flex">
                {
                      isActive ? 
                      <span className="bg-success-focus text-success-600 border border-success-main px-24 py-4 radius-4 fw-medium text-sm mr-10">
                        Active
                      </span> : 
                      <span className="bg-danger-focus text-danger-600 border border-danger-main px-24 py-4 radius-4 fw-medium text-sm mr-10">
                        Blocked
                      </span>
                    }

                    {
                      emailConfirmed ? 
                      <span className="bg-success-focus text-success-600 border border-success-main px-24 py-4 radius-4 fw-medium text-sm">
                        Verified
                      </span> : 
                      <span className="bg-warning-focus text-warning-600 border border-warning-main px-24 py-4 radius-4 fw-medium text-sm">
                        Not Verified
                      </span>
                    }
                    
                  </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="col-lg-8">
        
        {!pageLoading && (
          <div className="card h-100">
            <div className="card-body p-24">
            {showSuccess && <div
                className="alert alert-primary bg-primary-50 text-primary-600 border-primary-50 px-24 py-11 mb-0 text-lg radius-8 d-flex align-items-center justify-content-between mb-10"
                role="alert"
            >
                {showSuccess}
                <button className="remove-button text-primary-600 text-xxl line-height-1" onClick={() => setShowSuccess()}>
                {" "}
                <Icon icon="iconamoon:sign-times-light" className="icon" />
                </button>
            </div> }

            {showError && <div
                className="alert alert-danger bg-primary-50 text-danger-600 border-danger-50 px-24 py-11 mb-0 text-lg radius-8 d-flex align-items-center justify-content-between mb-10"
                role="alert"
            >
                {showError}
                <button className="remove-button text-danger-600 text-xxl line-height-1" onClick={() => setShowError()}>
                {" "}
                <Icon icon="iconamoon:sign-times-light" className="icon" />
                </button>
            </div> }
              <ul
                className="nav border-gradient-tab nav-pills mb-20 d-inline-flex"
                id="pills-tab"
                role="tablist"
              >
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center px-24 active"
                    id="pills-edit-profile-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-edit-profile"
                    type="button"
                    role="tab"
                    aria-controls="pills-edit-profile"
                    aria-selected="true"
                  >
                    Edit Profile
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link d-flex align-items-center px-24"
                    id="pills-change-passwork-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-change-passwork"
                    type="button"
                    role="tab"
                    aria-controls="pills-change-passwork"
                    aria-selected="false"
                    tabIndex={-1}
                  >
                    Change Password
                  </button>
                </li>
                {/* <li className="nav-item" role="presentation">
                                <button
                                    className="nav-link d-flex align-items-center px-24"
                                    id="pills-notification-tab"
                                    data-bs-toggle="pill"
                                    data-bs-target="#pills-notification"
                                    type="button"
                                    role="tab"
                                    aria-controls="pills-notification"
                                    aria-selected="false"
                                    tabIndex={-1}
                                >
                                    Notification Settings
                                </button>
                            </li> */}
              </ul>
              <div className="tab-content" id="pills-tabContent">
                <div
                  className="tab-pane fade show active"
                  id="pills-edit-profile"
                  role="tabpanel"
                  aria-labelledby="pills-edit-profile-tab"
                  tabIndex={0}
                >
                  <h6 className="text-md text-primary-light mb-16">
                    Profile Image
                  </h6>
                  {/* Upload Image Start */}
                  <div className="mb-24 mt-16">
                    <div className="avatar-upload">
                      <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                        <input
                          type="file"
                          id="imageUpload"
                          accept=".png, .jpg, .jpeg"
                          hidden
                          onChange={readURL}
                        
                        />
                        <label
                          htmlFor="imageUpload"
                          className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle"
                        >
                          <Icon
                            icon="solar:camera-outline"
                            className="icon"
                          ></Icon>
                        </label>
                      </div>
                      <div className="avatar-preview">
                        <div
                          id="imagePreview"
                          style={{
                            backgroundImage: `url(${
                              imagePreview && imagePreview != ""
                                ? imagePreview
                                : "assets/images/user.png"
                            })`,
                            backgroundSize: "contain",
                            backgroundPosition: "center",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                  {/* Upload Image End */}
                  <form onSubmit={handleSubmit}>
                    <div className="row">
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="name"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Full Name
                            <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control radius-8"
                            id="name"
                            placeholder="Enter Full Name"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            required="required"
                          />
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="email"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Email <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control radius-8 disabled"
                            id="email"
                            placeholder="Enter email address"
                            defaultValue={email}
                            disabled={true}
                            required="required"
                          />
                        </div>
                      </div>

                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="depart"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Role
                            <span className="text-danger-600">*</span>{" "}
                          </label>
                          <select
                            className="form-control radius-8 form-select"
                            id="depart"
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            required="required"
                            disabled="disabled"
                          >
                            <option value="Select User Role" disabled>
                              Select User Role
                            </option>
                            {roleData.map((role, index) => (
                              <option value={role.roleName} key={index}>
                                {role.roleName}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="col-sm-6">
                        <div className="mb-20">
                          <label
                            htmlFor="desig"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Interests
                            
                          </label>
                          <MultipleSelect
                            label=""
                            values={interests?.map((x) => x.id)}
                            options={interestData?.map((x) => {
                              return { label: x.name, value: x.id };
                            })}
                            onChange={handleInterestChange}
                            SelectProps={{
                              isCreatable: true,
                              msgNoOptionsAvailable:
                                "All categories are selected",
                              msgNoOptionsMatchFilter:
                                "No category name matches the filter",
                            }}
                          />
                        </div>
                      </div>
                      <div className="col-sm-12">
                        <div className="mb-20">
                          <label
                            htmlFor="desc"
                            className="form-label fw-semibold text-primary-light text-sm mb-8"
                          >
                            Bio
                          </label>
                          <textarea
                            name="#0"
                            className="form-control radius-8"
                            id="desc"
                            placeholder="Write bio..."
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="d-flex align-items-center justify-content-center gap-3">
                      <button
                        type="button"
                        className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                        onClick={handleCancel}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="d-flex justify-content-center btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                        disabled={loading}
                      >
                        <ThreeDots
                          height="22"
                          width="22"
                          radius="5"
                          color="#fff"
                          ariaLabel="loading"
                          wrapperStyle={{ marginRight: 5 }}
                          wrapperClass=""
                          visible={loading}
                        />
                        Save
                      </button>
                    </div>
                  </form>
                </div>
                <div
                  className="tab-pane fade"
                  id="pills-change-passwork"
                  role="tabpanel"
                  aria-labelledby="pills-change-passwork-tab"
                  tabIndex="0"
                >

                {!state?.userId && <div className="mb-20">
                    <label
                      htmlFor="your-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Old Password <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={oldPasswprdVisible ? "text" : "password"}
                        className="form-control radius-8"
                        id="old-password"
                        placeholder="Enter Old Password*"
                        value={oldPassword}
                        onChange={(e) => setOldPassword(e.target.value)}
                      />
                      <span
                        className={`toggle-password ${
                          oldPasswprdVisible ? "ri-eye-off-line" : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleOldPasswordVisibility}
                      ></span>
                    </div>
                    {errors?.oldPassword && <span className="text-danger-500 text-sm">{errors?.oldPassword}</span>}
                  </div>
                }
                  <div className="mb-20">
                    <label
                      htmlFor="your-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      New Password <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={passwordVisible ? "text" : "password"}
                        className="form-control radius-8"
                        id="your-password"
                        placeholder="Enter New Password*"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                      <span
                        className={`toggle-password ${
                          passwordVisible ? "ri-eye-off-line" : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={togglePasswordVisibility}
                      ></span>
                    </div>
                    {errors?.password && <span className="text-danger-500 text-sm">{errors?.password}</span>}
                    
                  </div>

                  <div className="mb-20">
                    <label
                      htmlFor="confirm-password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Confirm Password{" "}
                      <span className="text-danger-600">*</span>
                    </label>
                    <div className="position-relative">
                      <input
                        type={confirmPasswordVisible ? "text" : "password"}
                        className="form-control radius-8"
                        id="confirm-password"
                        placeholder="Confirm Password*"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                      <span
                        className={`toggle-password ${
                          confirmPasswordVisible
                            ? "ri-eye-off-line"
                            : "ri-eye-line"
                        } cursor-pointer position-absolute end-0 top-50 translate-middle-y me-16 text-secondary-light`}
                        onClick={toggleConfirmPasswordVisibility}
                      ></span>
                    </div>
                    {errors?.confirmPassword && <span className="text-danger-500 text-sm">{errors?.confirmPassword}</span>}
                    
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-3">
                      <button
                        type="button"
                        className="d-flex justify-content-center btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8"
                        onClick={submitChangePassword}
                        disabled={loading}
                      >
                        <ThreeDots
                          height="22"
                          width="22"
                          radius="5"
                          color="#fff"
                          ariaLabel="loading"
                          wrapperStyle={{ marginRight: 5 }}
                          wrapperClass=""
                          visible={loading}
                        />
                        Save
                      </button>
                    </div>
                </div>
                
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewProfileLayer;
