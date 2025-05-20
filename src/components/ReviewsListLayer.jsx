import { Icon } from "@iconify/react/dist/iconify.js";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../helper/axios";
import { Endpoints } from "../helper/common/Endpoint";
import { ThreeDots } from "react-loader-spinner";
import Paginator from "./child/Paginator";
import { Button, Modal } from "react-bootstrap";
import { ReviewStatus } from "../helper/common/Enum";

const ReviewsListLayer = () => {
  const [reviewList, setReviewList] = useState([]);
  const [reviewOldList, setReviewListOld] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [showPopup, setShowPopup] = useState(false);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState();
  const [popupLoading, setPopupLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const response = await apiRequest.get(Endpoints.GET_ALL_REVIEWS);
    setLoading(false);
    if (response && response.data) {
      setReviewList(response.data.data);
      setReviewListOld(response.data.data);
    }
  };

  const onStatusChange = (evt) => {
    
    if (evt.target.value) {
      let filtered = reviewOldList.filter((x) => x.status == evt.target.value);
      setReviewList(filtered);
    } else {
      setReviewList(reviewOldList);
    }
  };

  const onSearchValueChange = (evt) => {
    let value = evt.target.value.toLowerCase();
    if (value && reviewOldList?.length > 0) {
      let filtered = reviewOldList?.filter(
        (x) =>
          x.title.toLowerCase().includes(value) ||
          x.description.toLowerCase().includes(value) ||
          x.user?.fullName.toLowerCase().includes(value) ||
          x.category?.name.toLowerCase().includes(value) ||
          x.subCategory?.name.toLowerCase().includes(value)
      );
      setReviewList(filtered);
    } else {
      setReviewList(reviewOldList);
    }
  };

  const getCurrentPageData = () => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = Math.min(startIndex + pageSize, reviewList?.length);
    return reviewList?.slice(startIndex, endIndex);
  };

  const openDeletePopup = (userId) => {
    setSelectedReviewId(userId);
    setShowPopup(true);
  };

  const handleClose = () => {
    setSelectedReviewId(null);
    setShowPopup(false);
  };

  const handleConfirm = async () => {
    setPopupLoading(true);
    const result = await apiRequest.delete(
      Endpoints.DELETE_REVIEW, {data: {reviewId: selectedReviewId}}
    );
    setPopupLoading(false);
    if (result?.data?.success) {
      deleteFromData(selectedReviewId);
    }
    setShowPopup(false);
  };

  const openStatusPopup = (userId, status) => {
    setSelectedReviewId(userId);
    setShowStatusPopup(status);
  };

  const handleStatusPopupClose = () => {
    setSelectedReviewId(null);
    setShowStatusPopup();
  };

  const handleStatusPopupConfirm = async (status) => {
    setPopupLoading(true);
    let data = {
      id: selectedReviewId,
      status: status
    };
    if (status == ReviewStatus.Rejected) {
      data = { ...data, rejectionReason: rejectionReason };
    }
    const result = await apiRequest.patch(Endpoints.UPDATE_REVIEW_STATUS, data)
    setPopupLoading(false);

    if (result?.data?.success) {
      loadData();
    }
    setShowStatusPopup();
  };

  const deleteFromData = (id) => {
    const filteredOld = reviewOldList.filter((i) => i?.id !== id);
    setReviewListOld(filteredOld);
    const filtered = reviewList.filter((i) => i?.id !== id);
    setReviewList(filtered);
  };

  const getStatusString = (value) => Object.keys(ReviewStatus).find(key => ReviewStatus[key] === value);

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
        <Modal.Body>Are you sure you want to delete this review?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirm}
            disabled={popupLoading}
            className="d-flex align-items-center"
          >
            <ThreeDots
              height="20"
              width="20"
              radius="5"
              color="#fff"
              ariaLabel="loading"
              wrapperStyle={{ marginRight: 5 }}
              wrapperClass=""
              visible={popupLoading}
            />
            Confirm
          </Button>
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
          Are you sure you want this review to be {" "}
          <span className="tw-semibold">{getStatusString(showStatusPopup)}</span>?
          {showStatusPopup == ReviewStatus.Rejected ? (
            <input
              className="form-control radius-8"
              type="text"
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Reason to reject?"
              required
            />
          ) : (
            <></>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleStatusPopupClose}>
            Close
          </Button>
          <Button
            variant="primary"
            disabled={popupLoading}
            className="d-flex align-items-center"
            onClick={() =>
              showStatusPopup == ReviewStatus.Rejected
                ? rejectionReason != "" &&
                  handleStatusPopupConfirm(showStatusPopup)
                : handleStatusPopupConfirm(showStatusPopup)
            }
          >
            <ThreeDots
              height="20"
              width="20"
              radius="5"
              color="#fff"
              ariaLabel="loading"
              wrapperStyle={{ marginRight: 5 }}
              wrapperClass=""
              visible={popupLoading}
            />
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
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
            <select
              className="form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
              onChange={onStatusChange}
              defaultValue="Select Status"
            >
              <option value="Select Status" disabled>Select Status</option>
              <option value="">All</option>
              <option value="1">Pending</option>
              <option value="2">Approved</option>
              <option value="3">Rejected</option>
            </select>
          </div>
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
                      <th scope="col">Title</th>
                      <th scope="col">Category</th>
                      <th scope="col">Sub-category</th>
                      <th scope="col">Posted By</th>
                      <th scope="col">Posted Date</th>
                      <th scope="col" className="text-center">
                        Status
                      </th>
                      <th scope="col">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {getCurrentPageData()?.map((data, index) => (
                      <ReviewRow
                        key={index}
                        data={data}
                        index={index}
                        openDeletePopup={openDeletePopup}
                        openStatusPopup={openStatusPopup}
                      />
                    ))}
                  </tbody>
                </table>
                <Paginator
                  totalRows={reviewList?.length}
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

const ReviewRow = ({ data, index, openDeletePopup, openStatusPopup }) => {
  const navigate = useNavigate();

  const viewReviewClicked = () => {
    navigate("/view-review", { state: data });
  };

  const editReviewClicked = () => {
    navigate("/edit-profile", { state: data });
  };

  const postedDateTime = new Date(data?.postedDateTime);

  return (
    <tr key={index}>
      {/* <td>
        <div className="d-flex align-items-center gap-10">{index + 1}</div>
      </td> */}
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.title}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.category?.name}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.subCategory?.name ? data?.subCategory?.name : "N/A"}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {data?.user?.fullName}
        </span>
      </td>
      <td>
        <span className="text-md mb-0 fw-normal text-secondary-light">
          {postedDateTime.toDateString()}
        </span>
      </td>
      <td className="text-center">
        {data?.status == ReviewStatus.Approved ? (
          <span className="bg-success-focus text-success-600 border border-success-main px-24 py-4 radius-4 fw-medium text-sm">
            Approved
          </span>
        ) : data?.status == ReviewStatus.Pending ? (
          <span className="bg-warning-focus text-warning-600 border border-warning-main px-24 py-4 radius-4 fw-medium text-sm">
            Pending
          </span>
        ) : data?.status == ReviewStatus.Rejected ? (
          <span
            className="bg-danger-focus text-danger-600 border border-danger-main px-24 py-4 radius-4 fw-medium text-sm"
            onClick={() => openStatusPopup(data?.id, "Activate")}
          >
            Rejected
          </span>
        ) : (
          <></>
        )}
      </td>
      <td className="text-left">
        <div className="d-flex align-items-center gap-10 justify-content-start">
          <button
            type="button"
            className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={viewReviewClicked}
          >
            <Icon icon="majesticons:eye-line" className="icon text-xl" />
          </button>
          <button
            type="button"
            className="bg-success-focus text-success-600 bg-hover-success-200 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
            onClick={editReviewClicked}
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
          {data?.status == ReviewStatus.Pending ? (
            <>
              <button
                type="button"
                className="bg-warning-focus bg-hover-warning-200 text-warning-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                onClick={() => openStatusPopup(data?.id, ReviewStatus.Rejected)}
              >
                <Icon
                  icon="fluent:presence-blocked-24-regular"
                  className="menu-icon"
                />
              </button>
              <button
                type="button"
                className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                onClick={() => openStatusPopup(data?.id, ReviewStatus.Approved)}
              >
                <Icon icon="fa6-solid:check" className="menu-icon" />
              </button>
            </>
          ) : data?.status == ReviewStatus.Approved ? (
            <button
              type="button"
              className="bg-warning-focus bg-hover-warning-200 text-warning-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              onClick={() => openStatusPopup(data?.id, ReviewStatus.Rejected)}
            >
              <Icon
                icon="fluent:presence-blocked-24-regular"
                className="menu-icon"
              />
            </button>
          ) : (
            <button
              type="button"
              className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
              onClick={() => openStatusPopup(data?.id, ReviewStatus.Approved)}
            >
              <Icon icon="fa6-solid:check" className="menu-icon" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
};

export default ReviewsListLayer;
