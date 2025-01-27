import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { ThreeDots } from "react-loader-spinner";
import Paginator from "./child/Paginator";
import { Button, Modal } from "react-bootstrap";

const UsersListLayer = () => {
  const [userList, setUserList] = useState([]);
  const [userListOld, setUserListOld] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null)

  useEffect(() => {
    getUserData();
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
          x.roles.includes(value)
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
    const result = await apiRequest.delete(Endpoints.DELETE_USER + "/" + selectedUserId);
    if(result && result.data && result.data.data?.success){
        getUserData()
    }
    setShowPopup(false)
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
          <Button variant="primary" onClick={handleConfirm}>Confirm</Button>
        </Modal.Footer>
      </Modal>
    <div className="card h-100 p-0 radius-12">
      <div className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
        <div className="d-flex align-items-center flex-wrap gap-3">
          <span className="text-md fw-medium text-secondary-light mb-0">
            Show
          </span>
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
          <select
            className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
            onChange={onStatusChange}
            defaultValue="Select Status"
          >
            <option value="Select Status">Select Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
        </div>
        <Link
          to="/add-user"
          className="btn btn-primary text-sm btn-sm px-12 py-12 radius-8 d-flex align-items-center gap-2"
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
                  <tr>
                    <th scope="col">
                      <div className="d-flex align-items-center gap-10">
                        S.no
                      </div>
                    </th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Role</th>
                    <th scope="col" className="text-center">
                      Status
                    </th>
                    <th scope="col" className="text-center">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {getCurrentPageData()?.map((data, index) =>
                    <UserRow data={data} index={index} openDeletePopup={openDeletePopup}/>
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

const UserRow = ({data, index, openDeletePopup}) => {
    
 const navigate = useNavigate();
 
    const profilePicture = data?.profilePicture
    ? data.profilePicture
    : "assets/images/user.png";

 
  const viewUserClicked = () => {
    navigate("/view-profile", {state : {userId: data?.id}})
  }

  const editUserClicked = () => {
    navigate("/view-profile", {state :  {userId: data?.id}})
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
        {data?.isActive ? (
          <span className="bg-success-focus text-success-600 border border-success-main px-24 py-4 radius-4 fw-medium text-sm">
            Active
          </span>
        ) : (
          <span className="bg-danger-focus text-danger-600 border border-danger-main px-24 py-4 radius-4 fw-medium text-sm">
            Blocked
          </span>
        )}
      </td>
      <td className="text-center">
        <div className="d-flex align-items-center gap-10 justify-content-center">
          <button
            type="button"
            className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={viewUserClicked}
          >
            <Icon icon="majesticons:eye-line" className="icon text-xl" />
          </button>
          <button
            type="button"
            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={editUserClicked}
          >
            <Icon icon="lucide:edit" className="menu-icon" />
          </button>
          <button
            type="button"
            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={() => openDeletePopup(data?.id)}
          >
            <Icon icon="fluent:delete-24-regular" className="menu-icon" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default UsersListLayer;
