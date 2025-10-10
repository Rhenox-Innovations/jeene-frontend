import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { UserRole } from "../helper/common/Enum";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { ThreeDots } from "react-loader-spinner";

const AddUserLayer = () => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Select Role");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [roleList, setRoleList] = useState([]);
  useEffect(() => {
    const loadRoles = async () => {
      try{
        const response = await apiRequest.get(Endpoints.GET_ROLES);
        if(response?.data?.data){
          setRoleList(response.data.data);
        }
      }catch(e){
        // silently ignore; dropdown will show static placeholder
      }
    }
    loadRoles();
  }, []);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState();

  const [errors, setErrors] = useState({});

  const submitHandler = async (e) => {
    e.preventDefault()

    setShowSuccess(false)
    setShowError()

    if(validate()){
        setLoading(true)
        const requestData = {
            fullName,
            email,
            roles: [role],
            password,
            confirmationPassword: confirmPassword
        }
        try{
            const result = await apiRequest.post(Endpoints.CREATE_USER, requestData);
            setLoading(false)
            if(result?.status === 200 && result?.data?.success){
                showSuccessMessage()
                cancelHandler()
            }
        }catch(err){
            setLoading(false)
            setShowError(err?.response?.data?.Message)
        }   
    }
  }

  const cancelHandler = () => {
    setFullName("")
    setEmail("")
    setRole("Select Role")
    setPassword("")
    setConfirmPassword("")
  }

  const showSuccessMessage = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const validate = () => {
    setErrors({})
    var errorList = {}
    let passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@.#$!%*?&])[A-Za-z\d@.#$!%*?&]{8,25}$/
    
    if(!passwordRegex.test(password)){
        errorList = {...errorList, password: "Password must be 8 charachters long with at least single uppercase and lowercase alphabet, single number and single special character"}
    }

    if(password !== confirmPassword){
        errorList = {...errorList, confirmationPassword: "Password and Confirm Password doesn't match!"}
    }

    setErrors(errorList)
    return Object.keys(errorList).length <= 0
  }
  
  return (
    <div className="card h-100 p-0 radius-12">
      <div className="card-body p-24">
        <div className="row justify-content-center">
            
          <div className="col-xxl-6 col-xl-8 col-lg-10">
          {showSuccess && <div
                            className="alert alert-primary bg-primary-50 text-primary-600 border-primary-50 px-24 py-11 mb-0 text-lg radius-8 d-flex align-items-center justify-content-between mb-10"
                            role="alert"
                        >
                            User created successfully!
                            <button className="remove-button text-primary-600 text-xxl line-height-1" onClick={() => setShowSuccess(false)}>
                            {" "}
                            <Icon icon="iconamoon:sign-times-light" className="icon" />
                            </button>
                        </div> }

            {showError && <div
                            className="alert alert-danger bg-danger-50 text-danger-600 border-danger-50 px-24 py-11 mb-0 text-lg radius-8 d-flex align-items-center justify-content-between mb-10"
                            role="alert"
                        >
                           {showError}
                            <button className="remove-button text-danger-600 text-xxl line-height-1" onClick={() => setShowError(false)}>
                            {" "}
                            <Icon icon="iconamoon:sign-times-light" className="icon" />
                            </button>
                        </div> }
            <div className="card border">
              <div className="card-body">
                {/* <h6 className="text-md text-primary-light mb-16">Profile Image</h6> */}
                {/* Upload Image Start */}
                {/* <div className="mb-24 mt-16">
                                    <div className="avatar-upload">
                                        <div className="avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer">
                                            <input
                                                type="file"
                                                id="imageUpload"
                                                accept=".png, .jpg, .jpeg"
                                                hidden
                                                onChange={handleImageChange}
                                            />
                                            <label
                                                htmlFor="imageUpload"
                                                className="w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle">
                                                <Icon icon="solar:camera-outline" className="icon"></Icon>
                                            </label>
                                        </div>
                                        <div className="avatar-preview">
                                            <div
                                                id="imagePreview"
                                                style={{
                                                    backgroundImage: imagePreviewUrl ? `url(${imagePreviewUrl})` : '',

                                                }}
                                            >
                                            </div>
                                        </div>
                                    </div>
                                </div> */}
                {/* Upload Image End */}
                <form onSubmit={submitHandler}>
                  <div className="mb-20">
                    <label
                      htmlFor="name"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Name <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="name"
                      placeholder="Enter Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="mb-20">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Email <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="email"
                      className="form-control radius-8"
                      id="email"
                      placeholder="Enter email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

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
                      required
                    >
                      <option value="Select Role" disabled>
                        Select Role
                      </option>
                      {roleList?.filter((r) => r?.name !== 'User')?.map((r) => (
                        <option key={r?.id || r?.name} value={r?.name}>{r?.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-20">
                    <label
                      htmlFor="password"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Password <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control radius-8"
                      id="password"
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    {errors?.password && <span className="text-danger-500 text-sm">{errors?.password}</span>}
                  </div>
                  <div className="mb-20">
                    <label
                      htmlFor="email"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Confirm Password{" "}
                      <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="password"
                      className="form-control radius-8"
                      id="confirm-password"
                      placeholder="Enter Confirm Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />
                    {errors?.confirmationPassword && <span className="text-danger-500 text-sm">{errors?.confirmationPassword}</span>}
                  </div>
                  <div className="d-flex align-items-center justify-content-center gap-3">
                    <button
                      type="button"
                      className="border border-danger-600 bg-hover-danger-200 text-danger-600 text-md px-56 py-11 radius-8"
                      onClick={cancelHandler}
                    >
                      Reset
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary border border-primary-600 text-md px-56 py-12 radius-8 d-flex"
                      disabled={loading}
                    >
                        <ThreeDots
                                        height="22"
                                        width="22"
                                        radius="5"
                                        color="#fff"
                                        ariaLabel="loading"
                                        wrapperStyle={{marginRight: 5}}
                                        wrapperClass=""
                                        visible={loading}
                                      />
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddUserLayer;
