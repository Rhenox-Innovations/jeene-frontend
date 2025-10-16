import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { ThreeDots } from "react-loader-spinner";
import Paginator from "./child/Paginator";
import { Button, Modal } from "react-bootstrap";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { navigatePage } from "../helper/common/Navigation";
import numeral from "numeral";

const UsersListLayer = () => {
  const [userList, setUserList] = useState([]);
  const [userListOld, setUserListOld] = useState([]);
  const [roleList, setRoleList] = useState([]);

  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState();
  const [popupLoading, setPopupLoading] = useState(false);
  const [deactiveReason, setDeactivateReason] = useState("");
  const [role, setRole] = useState("");
  const [status, setStatus] = useState("");
  const [verified, setVerified] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => { 
    getUserData();
    getRoleData();
  }, []);

  const getUserData = async () => {
    setLoading(true);
    const response = await apiRequest.get(Endpoints.GET_ALL_USER_DETAILS);
    setLoading(false);
    if (response && response.data) {
      setUserList(response.data.data);
      setUserListOld(response.data.data);
    }
  };

  const getRoleData = async () => {
    let response = await apiRequest.get(Endpoints.GET_ROLES);
    if (response && response.data) {
      setRoleList(response.data.data);
    }
  }

  const onStatusChange = (evt) => {
    if (evt.target.value === "Active") {
      let filtered = userListOld.filter((x) => x.isActive);
      setUserList(filtered);
    } else if (evt.target.value === "Blocked") {
      let filtered = userListOld.filter((x) => !x.isActive);
      setUserList(filtered);
    } else {
      setUserList(userListOld);
    }
  };

  const onSearchValueChange = (evt) => {
    let value = evt.target.value.toLowerCase();
    if (value && userListOld?.length > 0) {
      let filtered = userListOld?.filter(
        (x) =>
          x.fullName.toLowerCase().includes(value) ||
          x.email.toLowerCase().includes(value) ||
          x.roles.includes(value) ||
          x.totalReviews == (value) || 
          x.createdOn.includes(value)
      );
      setUserList(filtered);
    } else {
      setUserList(userListOld);
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, userList?.length);
    return userList?.slice(startIndex, endIndex);
  };

  const openDeletePopup = (userId) => {
    setSelectedUserId(userId)
    setShowPopup(true)
  }

  const handleClose = () => {
    setSelectedUserId(null)
    setShowPopup(false)
  }

  const handleConfirm = async () => {
    setPopupLoading(true)
    const result = await apiRequest.delete(Endpoints.DELETE_USER + "/" + selectedUserId);
    setPopupLoading(false)
    if(result?.data?.success){
      deleteFromUserData(selectedUserId)
    }
    setShowPopup(false)
  }

  const openStatusPopup = (userId, status) => {
    setSelectedUserId(userId)
    setShowStatusPopup(status)
  }

  
  const handleStatusPopupClose = () => {
    setSelectedUserId(null)
    setShowStatusPopup()
  }

  const handleStatusPopupConfirm = async (status) => {
    setPopupLoading(true)
    let data = {
      userId: selectedUserId
    }
    if(status == "Block"){
      data = {...data, deactivateReason: deactiveReason}
    }
    const result = status === "Activate" ? await apiRequest.post(Endpoints.ACTIVATE_USER, data) : await apiRequest.post(Endpoints.DEACTIVATE_USER, data);
    setPopupLoading(false)
    if(result?.data?.success){
        getUserData()
    }
    setShowStatusPopup()
  }

  const deleteFromUserData = (userId) => {
    const filteredOld = userListOld.filter((i) => i?.id !== userId);
    setUserListOld(filteredOld)
    const filtered = userList.filter((i) => i?.id !== userId);
    setUserList(filtered)
  }

  const onRoleChange = (e) => {
    if (e.target.value !== "") {
     let filtered = userListOld.filter((x) => x.roles.includes(e.target.value));
      setUserList(filtered);
    } else {
      setUserList(userListOld);
    }
  }

  const filterButtonClick = () => {
    debugger
    var userListFiltered = userListOld;
    if (status === "Active") {
      userListFiltered = userListFiltered.filter((x) => x.isActive);
    } else if (status === "Blocked") {
      userListFiltered = userListFiltered.filter((x) => !x.isActive);
    }

    if (role !== "") {
      userListFiltered = userListFiltered.filter((x) => x.roles.includes(role));
    }

    if (verified === "Verified") {
      userListFiltered = userListFiltered.filter((x) => x.emailConfirmed);
    } else if (verified === "Not Verified") {
      userListFiltered = userListFiltered.filter((x) => !x.emailConfirmed);
    }
    setUserList(userListFiltered);
  }

  return (
    <>
    <Modal
        show={showPopup}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this user?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleConfirm} disabled={popupLoading} className="d-flex align-items-center"> 
            <ThreeDots
                height="20"
                width="20"
                radius="5"
                color="#fff"
                ariaLabel="loading"
                wrapperStyle={{ marginRight: 5 }}
                wrapperClass=""
                visible={popupLoading}
              />Confirm</Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showStatusPopup}
        onHide={handleStatusPopupClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to <span className="tw-semibold">{showStatusPopup}</span> this user?
        {showStatusPopup == "Block" ? <input  className="form-control radius-8" type="text" onChange={(e) => setDeactivateReason(e.target.value)} placeholder="Reason to block?" required /> :<></> }
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleStatusPopupClose}>
            Close
          </Button>
          <Button variant="primary" disabled={popupLoading} className="d-flex align-items-center"
          onClick={() => showStatusPopup == "Block" ? deactiveReason != "" && handleStatusPopupConfirm(showStatusPopup) : handleStatusPopupConfirm(showStatusPopup)}>
            <ThreeDots
                height="20"
                width="20"
                radius="5"
                color="#fff"
                ariaLabel="loading"
                wrapperStyle={{ marginRight: 5 }}
                wrapperClass=""
                visible={popupLoading}/>
            Confirm</Button>
        </Modal.Footer>
      </Modal>
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
        <span className="text-md fw-medium text-secondary-light mb-0">Show</span>
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
          <form className="navbar-search" onSubmit={(e) => e.preventDefault()}>
            <input
              type="text"
              className="bg-base h-40-px w-auto"
              name="search"
              placeholder="Search"
              onChange={onSearchValueChange}
            />
            <Icon icon="ion:search-outline" className="icon" />
          </form>
          
          <select
            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
            onChange={(e) => setStatus(e.target.value)}
            value={status}
          >
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select
            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
            onChange={(e) => setVerified(e.target.value)}
            value={verified}
          >
            <option value="">Select Verification</option>
            <option value="Verified">Verified</option>
            <option value="Not Verified">Not Verified</option>
          </select>
          <select
            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
            onChange={(e) => setRole(e.target.value)}
            value={role}
          >
            <option value="">Select Role</option>
            {
              roleList?.map((role, index) => <option key={index} value={role.name}>{role.name}</option>)
            }
          </select>
           <button
                type="button"
                className="btn rounded-pill-bordered text-primary-600 radius-8 px-20 py-11"
                onClick={filterButtonClick}
                disabled={loading}
              >
                Filter
              </button>
        </div>
        <Link
          to="/add-user"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
          onClick={() => navigatePage(navigate, dispatch, "/add-user")}
        >
          <Icon
            icon="ic:baseline-plus"
            className="icon text-xl line-height-1"
          />
          Add New User
        </Link>
      </div>
      <div className="card-body p-24">
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
                  <tr key={-1}>
                    {/* <th scope="col">
                      <div className="d-flex align-items-center gap-10">
                        S.no
                      </div>
                    </th> */}
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Joining Date</th>
                    <th scope="col">Total Reviews</th>
                    <th scope="col">Verified</th>
                    <th scope="col" className="text-center">
                      Status
                    </th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {userList?.length === 0 ? <tr><td>No records found.</td></tr> : 
                    getCurrentPageData()?.map((data, index) =>
                    <UserRow key={index} data={data} index={index} openDeletePopup={openDeletePopup} openStatusPopup={openStatusPopup}/>
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
    </>
  );
};

const UserRow = ({data, index, openDeletePopup, openStatusPopup}) => {
 const permissions = useSelector(state => state?.auth?.permissions)
 const navigate = useNavigate();
 const dispatch = useDispatch();

    const profilePicture = data?.profilePicture
    ? data.profilePicture
    : "assets/images/user.png";

 
  const viewUserClicked = () => {
    navigatePage(navigate, dispatch, "/view-profile", {state : {userId: data?.id}})
    
  }

  const editUserClicked = () => {
    navigatePage(navigate, dispatch, "/view-profile", {state : {userId: data?.id}})

  }

  const joiningDate = new Date(data?.createdOn)

  return (
    <tr key={index}>
      {/* <td>
        <div className="d-flex align-items-center gap-10">{index + 1}</div>
      </td> */}
      <td>
        <div className="d-flex align-items-center">
          <img
            src={profilePicture}
            alt="profile"
            className="w-40-px h-40-px rounded-circle flex-shrink-0 me-12 overflow-hidden"
          />
          <div className="flex-grow-1 row">
            <span className="text-md mb-0 fw-normal text-secondary-light">
              {data?.fullName}
            </span>
            <div>
            <span className="badge text-xsm fw-semibold rounded-pill bg-light-600 px-20 py-4 radius-4 text-dark">{data?.roles?.[0]}</span>
            </div>
          </div>
        </div>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.email}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {joiningDate.toDateString()}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {numeral(data?.totalReviews).format('0.[0]a')}
        </span>
      </td>
      <td>{data?.emailConfirmed ? (
          <span className="bg-success-focus text-success-600  border-success-main px-24 py-4 radius-4 fw-medium text-sm">
            Verified
          </span>
        ) : (
          <span className="bg-warning-focus text-warning-600  border-warning-main px-24 py-4 radius-4 fw-medium text-sm">
            Not Verified
          </span>
        )}</td>
      <td className="text-center">
        {data?.isActive ? (
          <span className="bg-success-focus text-success-600  border-success-main px-24 py-4 radius-4 fw-medium text-sm"
          onClick={() => openStatusPopup(data?.id, "Block")}>
            Active
          </span>
        ) : (
          <span className="bg-danger-focus text-danger-600  border-danger-main px-24 py-4 radius-4 fw-medium text-sm"
          onClick={() => openStatusPopup(data?.id, "Activate")}>
            Blocked
          </span>
        )}
      </td>
      <td className="text-center">
        <div className="d-flex align-items-center gap-10 justify-content-start">
          {
            permissions?.includes("/view-user-profile") &&
            <button
              type="button"
              className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              onClick={viewUserClicked}
              title="View Details"
            >
              <Icon icon="majesticons:eye-line" className="icon text-xl" />
            </button>
          }
          {
             permissions?.includes("/edit-user") &&
            <button
              type="button"
              className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              onClick={editUserClicked}
              title="Edit User"
            >
              <Icon icon="lucide:edit" className="menu-icon" />
            </button>
          }
          {
           data?.roles?.[0] != "Admin" && permissions?.includes("/delete-user") && 
            <button
                type="button"
                className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                onClick={() => openDeletePopup(data?.id)}
                title="Delete User"

              >
                <Icon icon="fluent:delete-24-regular" className="menu-icon" />
              </button>
          } 
          
          {data?.roles?.[0] != "Admin" && 
            <>{ permissions?.includes("/activate-block-user") && data?.isActive ? <button
            type="button"
            className="bg-warning-focus bg-hover-warning-200 text-warning-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={() => openStatusPopup(data?.id, "Block")}
            title="Block User"

          >
            <Icon icon="fluent:presence-blocked-24-regular" className="menu-icon" />
          </button> : 
          <button
            type="button"
            className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={() => openStatusPopup(data?.id, "Activate")}
            title="Activate User"


          >
            <Icon icon="fa6-solid:check" className="menu-icon" />
          </button>
            }</>}
        </div>
      </td>
    </tr>
  );
};

export default UsersListLayer;
