import {Icon} from "@iconify/react/dist/iconify.js";
import React, {useEffect, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import apiRequest from "../helper/axios";
import {Endpoints} from "../helper/common/Endpoint";
import {ThreeDots} from "react-loader-spinner";
import Paginator from "./child/Paginator";
import {Button, Modal} from "react-bootstrap";
import {ReviewStatus} from "../helper/common/Enum";
import {useSelector} from "react-redux";
import {useDispatch} from "react-redux";
import {navigatePage} from "../helper/common/Navigation";
import {getDateTime} from "../helper/common/Formatters";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ReviewsListLayer = () => {
    const [reviewList, setReviewList] = useState([]);
    const [reviewOldList, setReviewListOld] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pageSize, setPageSize] = useState(10);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [showPopup, setShowPopup] = useState(false);
    const [selectedReviewId, setSelectedReviewId] = useState(null);
    const [showStatusPopup, setShowStatusPopup] = useState();
    const [popupLoading, setPopupLoading] = useState(false);
    const [rejectionReason, setRejectionReason] = useState("");
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [status, setStatus] = useState("");

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async (currentPageIn) => {
        var newStartDate = new Date();
        newStartDate.setMonth(newStartDate.getMonth() - 3);
        setStartDate(getDateOnly(newStartDate));
        setEndDate(getDateOnly(new Date()));

        var params = {
            startDate: getDateOnly(newStartDate),
            endDate: getDateOnly(new Date()),
            pageSize: pageSize,
            pageNumber: currentPageIn ? currentPageIn : currentPage,
        }
        setLoading(true);
        let response = await apiRequest.get(Endpoints.GET_ALL_REVIEWS, {params});
        setLoading(false);

        if (response && response.data) {
            var reviewData = response.data.data?.sort((a, b) => {
                // First sort by status (ascending)
                const statusDiff = a.status - b.status;

                // If status is same, sort by date (descending — newest first)
                if (statusDiff === 0) {
                    return new Date(b.postedDateTime) - new Date(a.postedDateTime);
                }

                return statusDiff;
            });
            setTotalPages(response.data.totalPages);
            setTotalCount(response.data.totalCount);
            setReviewList(reviewData);
            setReviewListOld(reviewData);
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
                    x.user?.email.toLowerCase().includes(value) ||
                    x.category?.name.toLowerCase().includes(value) ||
                    x.subCategory?.name.toLowerCase().includes(value)
            );
            setReviewList(filtered);
        } else {
            setReviewList(reviewOldList);
        }
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
        const result = await apiRequest.delete(Endpoints.DELETE_REVIEW, {
            data: {reviewId: selectedReviewId},
        });
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
            status: status,
        };
        if (status == ReviewStatus.Rejected) {
            data = {...data, rejectionReason: rejectionReason};
        }
        const result = await apiRequest.patch(Endpoints.UPDATE_REVIEW_STATUS, data);
        setPopupLoading(false);

        if (result?.data?.success) {
            var reviewData = reviewOldList.find((x) => x.id == selectedReviewId);
            if (status == ReviewStatus.Rejected) {
                updateData({
                    ...reviewData,
                    status: status,
                    rejectionReason: rejectionReason,
                });
            } else {
                updateData({
                    ...reviewData,
                    status: status,
                });
            }
        }
        setShowStatusPopup();
    };

    const deleteFromData = (id) => {
        const filteredOld = reviewOldList.filter((i) => i?.id !== id);
        setReviewListOld(filteredOld);
        const filtered = reviewList.filter((i) => i?.id !== id);
        setReviewList(filtered);
    };

    const updateData = (newData) => {
        const filteredOld = reviewOldList.map((i) => {
            if (newData?.id == i?.id) {
                i.status = newData.status;
                i.rejectionReason = newData.rejectionReason;
            }
            return i;
        });
        setReviewListOld(filteredOld);
        const filtered = reviewList.filter((i) => {
            if (newData?.id == i?.id) {
                i.status = newData.status;
                i.rejectionReason = newData.rejectionReason;
            }
            return i;
        });
        setReviewList(filtered);
    };

    const getStatusString = (value) =>
        Object.keys(ReviewStatus).find((key) => ReviewStatus[key] === value);

    const filterButtonClick = async () => {
        var params = {};
        if (status != "") {
            params = {...params, status}
        }

        if (startDate) {
            params = {...params, startDate: startDate}
        }

        if (endDate) {
            params = {...params, endDate: endDate}
        }
        
        params = {...params, page: 1, pageSize: pageSize}

        setLoading(true);
        let response = await apiRequest.get(Endpoints.GET_ALL_REVIEWS, {params});
        setLoading(false);
        if (response && response.data) {
            var reviewData = response.data.data?.sort((a, b) => {
                // First sort by status (ascending)
                const statusDiff = a.status - b.status;

                // If status is same, sort by date (descending — newest first)
                if (statusDiff === 0) {
                    return new Date(b.postedDateTime) - new Date(a.postedDateTime);
                }

                return statusDiff;
            });
            setReviewList(reviewData);
            setReviewListOld(reviewData);
            setTotalPages(response.data.totalPages);
            setTotalCount(response.data.totalCount);
        }
    }

    const getDateOnly = (d) => {
        return `${d.getUTCFullYear()}-${("0" + (d.getUTCMonth() + 1)).slice(-2)}-${("0" + d.getUTCDate()).slice(-2)}`
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
                            wrapperStyle={{marginRight: 5}}
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
                    Are you sure you want this review to be{" "}
                    <span className="tw-semibold">
            {getStatusString(showStatusPopup)}
          </span>
                    ?
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
                            wrapperStyle={{marginRight: 5}}
                            wrapperClass=""
                            visible={popupLoading}
                        />
                        Confirm
                    </Button>
                </Modal.Footer>
            </Modal>
            <div className="card h-100 p-0 radius-12">
                <div
                    className="card-header border-bottom bg-base py-16 px-24 d-flex align-items-center flex-wrap gap-3 justify-content-between">
                    <div className="row w-100">
                        <div className="col-md-3">
                            <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-3 mb-12">
                                <div className="card-body p-0">
                                    <div
                                        className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                                        <div className="d-flex align-items-center gap-2 mb-12">
                      <span
                          className="mb-0 w-48-px h-48-px bg-base text-blue text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                        <i className="ri-user-star-fill"/>
                      </span>
                                            <div>
                        <span className="mb-0 fw-medium text-secondary-light text-lg">
                          Total Reviews
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                                        <h5 className="fw-semibold mb-0">
                                            {reviewList?.length
                                                ?.toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-1 mb-12">
                                <div className="card-body p-0">
                                    <div
                                        className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                                        <div className="d-flex align-items-center gap-2 mb-12">
                      <span
                          className="mb-0 w-48-px h-48-px bg-base text-yellow text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                        <i className="ri-time-fill"/>
                      </span>
                                            <div>
                        <span className="mb-0 fw-medium text-secondary-light text-lg">
                          Total Pending
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                                        <h5 className="fw-semibold mb-0">
                                            {reviewList
                                                ?.filter((x) => x.status === ReviewStatus.Pending)
                                                ?.length?.toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-3 mb-12">
                                <div className="card-body p-0">
                                    <div
                                        className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                                        <div className="d-flex align-items-center gap-2 mb-12">
                      <span
                          className="mb-0 w-48-px h-48-px bg-base text-blue text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                        <i className="ri-checkbox-circle-fill"/>
                      </span>
                                            <div>
                        <span className="mb-0 fw-medium text-secondary-light text-lg">
                          Total Approved
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                                        <h5 className="fw-semibold mb-0">
                                            {reviewList
                                                ?.filter((x) => x.status === ReviewStatus.Approved)
                                                ?.length?.toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="card p-3 radius-8 shadow-none bg-gradient-dark-start-1 mb-12">
                                <div className="card-body p-0">
                                    <div
                                        className="d-flex flex-wrap align-items-center justify-content-between gap-1 mb-0">
                                        <div className="d-flex align-items-center gap-2 mb-12">
                      <span
                          className="mb-0 w-48-px h-48-px bg-base text-pink text-2xl flex-shrink-0 d-flex justify-content-center align-items-center rounded-circle h6">
                        <i className="ri-close-circle-fill"/>
                      </span>
                                            <div>
                        <span className="mb-0 fw-medium text-secondary-light text-lg">
                          Total Rejected
                        </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-8">
                                        <h5 className="fw-semibold mb-0">
                                            {reviewList
                                                ?.filter((x) => x.status === ReviewStatus.Rejected)
                                                ?.length?.toString()
                                                .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                                        </h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                        <form
                            className="navbar-search"
                            onSubmit={(e) => e.preventDefault()}
                        >
                            <input
                                type="text"
                                className="bg-base h-40-px w-auto"
                                name="search"
                                placeholder="Search"
                                onChange={onSearchValueChange}
                            />
                            <Icon icon="ion:search-outline" className="icon"/>
                        </form>

                        <div className="d-flex">
                            <form
                                className="d-flex gap-3 align-items-center"
                                onSubmit={(e) => e.preventDefault()}
                            >
                                <select
                                    className="form-control form-select form-select-sm w-auto ps-12 py-6 radius-12 h-40-px"
                                    onChange={(e) => setStatus(e.target.value)}
                                    value={status}
                                >
                                    <option value="">All</option>
                                    <option value="1">Pending</option>
                                    <option value="2">Approved</option>
                                    <option value="3">Rejected</option>
                                </select>
                                <DatePicker
                                    selectsRange
                                    startDate={startDate}
                                    endDate={endDate}
                                    onChange={(dates) => {
                                        const [start, end] = dates;
                                        setStartDate(start);
                                        setEndDate(end);
                                    }}
                                    placeholderText="Select date range"
                                    className="bg-base form-control h-40-px w-auto"
                                    dateFormat="MM/dd/yyyy"
                                    calendarClassName="custom-datepicker"
                                    maxDate={startDate ? new Date(new Date(startDate).setMonth(new Date(startDate).getMonth() + 6)) : null}
                                />
                            </form>
                            <button
                                type="button"
                                className="btn rounded-pill-bordered text-primary-600 radius-8 px-20 py-11"
                                onClick={filterButtonClick}
                                disabled={loading}
                            >
                                Filter
                            </button>
                        </div>
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
                                    wrapperStyle={{marginRight: 5}}
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
                                        <th scope="col">Action</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {reviewList?.length === 0 ? <tr>
                                        <td>No records found.</td>
                                    </tr> : reviewList?.map((data, index) => (
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
                                    totalRows={totalCount}
                                    pageSize={pageSize}
                                    currentPage={currentPage}
                                    onPageChange={(currentPage) => {
                                        setCurrentPage(currentPage);
                                        loadData(currentPage);
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

const ReviewRow = ({data, index, openDeletePopup, openStatusPopup}) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const permissions = useSelector((state) => state?.auth?.permissions);

    const viewReviewClicked = () => {
        navigatePage(navigate, dispatch, "/review-details", {state: data});
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
          {getDateTime(data?.postedDateTime)}
        </span>
            </td>
            <td className="text-center">
                {data?.status == ReviewStatus.Approved ? (
                    <span
                        className="bg-success-focus text-success-600  border-success-main px-24 py-4 radius-4 fw-medium text-sm">
            Approved
          </span>
                ) : data?.status == ReviewStatus.Pending ? (
                    <span
                        className="bg-warning-focus text-warning-600 border-warning-main px-24 py-4 radius-4 fw-medium text-sm">
            Pending
          </span>
                ) : data?.status == ReviewStatus.Rejected ? (
                    <span
                        className="bg-danger-focus text-danger-600 border-danger-main px-24 py-4 radius-4 fw-medium text-sm">
            Rejected
          </span>
                ) : (
                    <></>
                )}
            </td>
            <td className="text-left">
                <div className="d-flex align-items-center gap-10 justify-content-start">
                    {permissions?.includes("/review-details") && (
                        <button
                            type="button"
                            className="bg-info-focus bg-hover-info-200 text-info-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={viewReviewClicked}
                            title="View Details"
                        >
                            <Icon icon="majesticons:eye-line" className="icon text-xl"/>
                        </button>
                    )}
                    {permissions?.includes("/delete-review") && (
                        <button
                            type="button"
                            className="remove-item-btn bg-danger-focus bg-hover-danger-200 text-danger-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={() => openDeletePopup(data?.id)}
                            title="Delete Review"
                        >
                            <Icon icon="fluent:delete-24-regular" className="menu-icon"/>
                        </button>
                    )}
                    {permissions?.includes("/approve-reject-review") &&
                        (data?.status == ReviewStatus.Pending ? (
                            <>
                                <button
                                    type="button"
                                    className="bg-warning-focus bg-hover-warning-200 text-warning-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                    onClick={() =>
                                        openStatusPopup(data?.id, ReviewStatus.Rejected)
                                    }
                                    title="Reject Review"
                                >
                                    <Icon
                                        icon="fluent:presence-blocked-24-regular"
                                        className="menu-icon"
                                    />
                                </button>
                                <button
                                    type="button"
                                    className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                                    onClick={() =>
                                        openStatusPopup(data?.id, ReviewStatus.Approved)
                                    }
                                    title="Approve Review"
                                >
                                    <Icon icon="fa6-solid:check" className="menu-icon"/>
                                </button>
                            </>
                        ) : data?.status == ReviewStatus.Approved ? (
                            <button
                                type="button"
                                title="Reject Review"
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
                                title="Approve Review"
                            >
                                <Icon icon="fa6-solid:check" className="menu-icon"/>
                            </button>
                        ))}
                </div>
            </td>
        </tr>
    );
};

export default ReviewsListLayer;
