import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useState } from "react";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { ThreeDots } from "react-loader-spinner";

const AddCategoryLayer = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [showOnDashboard, setShowOnDashboard] = useState(false);
  const [loading, setLoading] = useState(false);
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
            name,
            description,
            showOnDashboard
        }
        try{
            const result = await apiRequest.post(Endpoints.CREATE_CATEGORIES, requestData);
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
    setName("");
    setDescription("");
    setShowOnDashboard(false);
  }

  const showSuccessMessage = () => {
    setShowSuccess(true)
    setTimeout(() => setShowSuccess(false), 3000)
  }

  const validate = () => {
    setErrors({})
    var errorList = {}

    if(name.length < 3){
        errorList = {...errorList, name: "Name must have 3 or more characters"}
    }

    if(description.length < 3){
        errorList = {...errorList, description: "Description must have 3 or more characters"}
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
                            Category created successfully!
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
                      placeholder="Enter Name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                    {errors?.name && <span className="text-danger-500 text-sm">{errors?.name}</span>}
                  </div>
                  <div className="mb-20">
                    <label
                      htmlFor="description"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Description <span className="text-danger-600">*</span>
                    </label>
                    <input
                      type="text"
                      className="form-control radius-8"
                      id="email"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                    {errors?.description && <span className="text-danger-500 text-sm">{errors?.description}</span>}
                  </div>

                  <div className="mb-20">
                    <label
                      htmlFor="showOnDashboard"
                      className="form-label fw-semibold text-primary-light text-sm mb-8"
                    >
                      Show on dashboard
                      <span className="text-danger-600">*</span>{" "}
                    </label>
                    <select
                      className="form-control radius-8 form-select"
                      id="showOnDashboard"
                      value={showOnDashboard}
                      onChange={(e) => setShowOnDashboard(Boolean(e.target.value))}
                      required
                    >
                      <option value="Select" disabled>
                        Select
                      </option>
                      <option value={true}>Yes</option>
                      <option value={false}>
                        No
                      </option>
                      
                    </select>
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

export default AddCategoryLayer;