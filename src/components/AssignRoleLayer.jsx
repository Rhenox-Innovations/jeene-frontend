import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import Paginator from "./child/Paginator";
import { UserRole } from "../helper/common/Enum";
import { ThreeDots } from "react-loader-spinner";

const AssignRoleLayer = () => {
  const [userList, setUserList] = useState([]);
  const [userListOld, setUserListOld] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showSuccess, setShowSuccess] = useState();
  const [roleList, setRoleList] = useState([]);
  
  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async () => {
    setLoading(true);
    let response = await apiRequest.get(Endpoints.GET_ALL_USER_DETAILS);
   
    if (response?.data) {
      setUserList(response.data.data);
      setUserListOld(response.data.data);
    }
    response = await apiRequest.get(Endpoints.GET_ROLES);
    debugger
    if(response?.data){
      setRoleList(response.data.data);
    }
    setLoading(false);
  
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, userList?.length);
    return userList?.slice(startIndex, endIndex);
  };

  const showSuccessMessage = (message) => {
    setShowSuccess(message)
    setTimeout(() => setShowSuccess(), 3000)
  }

  const updateUserData = (userData) => {
    var newUserList = userList.map((val) => {
        if(val.id === userData.id){
            return userData
        }
        return val
    })
    setUserList(newUserList)
    var newUserListOld = userListOld.map((val) => {
        if(val.id === userData.id){
            return userData
        }
        return val
    })
    setUserListOld(newUserListOld)

  }

  const onSearchValueChange = (evt) => {
    let value = evt.target.value.toLowerCase();
    if (value && userListOld?.length > 0) {
      let filtered = userListOld?.filter(
        (x) =>
          x.fullName.toLowerCase().includes(value) ||
          x.email.toLowerCase().includes(value) ||
          x.roles.includes(value)
      );
      setUserList(filtered);
    } else {
      setUserList(userListOld);
    }
  };

  return (
    <div className="card h-100 p-0 radius-12">

      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-md fw-medium text-secondary-light mb-0">
            Show
          </span>
          <select
                        className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                        value={pageSize}
                        onChange={(e) => setPageSize(e.target.value)}
                    >
                        <option value="10">10</option>
                        <option value="20">20</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="1000">1000</option>
                    </select>
          <form className="navbar-search">
          <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              onChange={onSearchValueChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
          
          {/* <select
            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
            defaultValue="Status"
          >
            <option value="Status" disabled>
              Status
            </option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select> */}
        </div>
      </div>
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
        <div className="table-responsive scroll-sm">
                      {loading ? (
                        <div className="d-flex align-items-center justify-content-center">
                          <ThreeDots
                            height="80"
                            width="80"
                            radius="5"
                            color="#487FFF"
                            ariaLabel="loading"
                            wrapperStyle={{ marginRight: 5 }}
                            wrapperClass=""
                            visible={loading}
                          />
                        </div>
                      ) : (
                        <>
          <table className="table bordered-table sm-table mb-0">
            <thead>
              <tr key="A1">
                <th scope="col">S.no</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">
                  Role
                </th>
                <th scope="col" className="text-center">
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
            {getCurrentPageData()?.map((data, index) =>
                    <AssignRoleRow key={index} data={data} index={index} showSuccessMessage={showSuccessMessage} updateUserData={updateUserData} roleList={roleList}/>
                  )}
            </tbody>
          </table>
          <Paginator
                totalRows={userList?.length}
                pageSize={pageSize}
                onPageChange={(currentPage) => {
                  setCurrentPage(currentPage);
                }}
              />
              </>
            )}
        </div>
        
      </div>
    </div>
  );
};

const AssignRoleRow = ({data, index, showSuccessMessage, updateUserData, roleList }) => {

    const [loading, setLoading] = useState(false)
 
    const profilePicture = data?.profilePicture
    ? data.profilePicture
    : "assets/images/user.png";

    const assignRole = async (userRole) => {
        try{
            if(!loading){
                setLoading(true)
                const result = await apiRequest.put(Endpoints.EDIT_USER_ROLE, {
                    userId: data?.id,
                    roles: [
                        userRole
                    ]
                })
                setLoading(false)
    
                if(result?.data?.success){
                    showSuccessMessage("Role assigned to user successfully!");
                    var updatedData = {...data, roles: [userRole]}
                    updateUserData(updatedData)
                }
            }
        }catch(e){
            setLoading(false)
        }
        
    }



  return (
    <tr key={index}>
      <td>
        <div className="d-flex align-items-center gap-10">{index + 1}</div>
      </td>
      <td>
        <div className="d-flex align-items-center">
          <img
            src={profilePicture}
            alt="profile"
            className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
          />
          <div className="flex-grow-1">
            <span className="text-md mb-0 fw-normal text-secondary-light">
              {data?.fullName}
            </span>
          </div>
        </div>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.email}
        </span>
      </td>
      <td>{data?.roles?.[0]}</td>
      <td className="text-center">
      <div className="dropdown">
        
                    <button
                      className="btn btn-outline-primary-600 not-active px-18 py-11 dropdown-toggle toggle-icon d-flex align-items-center"
                      type="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      
                    >
                        <ThreeDots
                                          height="20"
                                          width="20"
                                          radius="5"
                                          color="#487FFF"
                                          ariaLabel="loading"
                                          wrapperStyle={{ marginRight: 5 }}
                                          wrapperClass=""
                                          visible={loading}
                                        />
                      Assign Role
                    </button>
                    <ul className="dropdown-menu" style={{}}>
                      {
                        roleList?.map((role) => 
                          <li>
                            <Link
                              className="dropdown-item px-16 py-8 rounded text-secondary-light bg-hover-neutral-200 text-hover-neutral-900"
                              onClick={() => assignRole(role.name)}
                            >
                              {role.name}
                            </Link>
                          </li>
                        )
                      }
                    </ul>
                  </div>
      </td>
    </tr>
  );
};
export default AssignRoleLayer;
