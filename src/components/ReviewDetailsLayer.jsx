import { Link, useLocation, useNavigate } from "react-router-dom";
import { Endpoints } from "../helper/common/Endpoint";
import { Icon } from "@iconify/react/dist/iconify.js";
import { ReviewStatus } from "../helper/common/Enum";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { useSelector } from "react-redux";
import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import apiRequest from "../helper/axios";
import { ThreeDots } from "react-loader-spinner";
import { useDispatch } from "react-redux";
import { navigatePage } from "../helper/common/Navigation";

const ReviewDetailsLayer = () => {
  const { state } = useLocation();
  const navigate = useNavigate()
  const dispatch = useDispatch();

  const permissions = useSelector((state) => state?.auth?.permissions);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState();
  const [popupLoading, setPopupLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  
  const [review, setReview] = useState(state);

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
    if (result?.data?.success) {
      await loadData();
      setPopupLoading(false);
    }
    setShowStatusPopup();
  };


  const loadData = async () => {

    let response = await apiRequest.get(Endpoints.REVIEW_BY_ID + "/" + state?.id);
    if (response && response.data) {
      setReview(response.data.data)
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
      data: { reviewId: selectedReviewId },
    });
    setPopupLoading(false);
    if (result?.data?.success) {
      alert("Review is deleted successfully!");
      navigatePage(navigate, dispatch, "/reviews-list");
    }
    setShowPopup(false);
  };

  const getStatusString = (value) => Object.keys(ReviewStatus).find(key => ReviewStatus[key] === value);
  const getDateTime = (dateTimeString) => {
    var date = new Date(dateTimeString);
    return `${("0"+(date.getDate())).slice(-2)}-${("0"+(date.getMonth()+1)).slice(-2)}-${date.getFullYear()} ${("0"+(date.getHours())).slice(-2)}:${("0"+(date.getMinutes())).slice(-2)}:${("0"+(date.getSeconds())).slice(-2)}`
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
              wrapperStyle={{ marginRight: 5 }}
              wrapperClass=""
              visible={popupLoading}
            />
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="col-lg-12">
        <div className="card h-100">
          <div className="card-body p-24">
            <div className="row mb-16">
              <div className="col-md-9">
                <h6 className="text-xl">{review?.title}</h6>

              </div>
              <div className="d-flex col-md-3 gap-10 justify-content-end">
                    {permissions?.includes("/approve-reject-review") &&
                        (review?.status == ReviewStatus.Pending ? (
                          <>
                          <button
                              type="button"
                              className="btn btn-outline-success-600 radius-8 px-20 py-11"
                              onClick={() =>
                                openStatusPopup(
                                  review?.id,
                                  ReviewStatus.Approved
                                )
                              }
                              title="Approve Review"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-warning-600 radius-8 px-20 py-11"
                              onClick={() =>
                                openStatusPopup(
                                  review?.id,
                                  ReviewStatus.Rejected
                                )
                              }
                              title="Reject Review"
                            >
                              Reject
                            </button>
                            
                          </>
                        ) : review?.status == ReviewStatus.Approved ? (
                          <button
                            type="button"
                            className="btn btn-outline-warning-600 radius-8 px-20 py-11"
                            onClick={() =>
                              openStatusPopup(review?.id, ReviewStatus.Rejected)
                            }
                            title="Reject Review"
                          >
                           Reject
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={() =>
                              openStatusPopup(review?.id, ReviewStatus.Approved)
                            }
                            title="Approve Review"
                          >
                            Approve
                          </button>
                        ))}
                        {permissions?.includes("/delete-review") &&
                          <button className="btn btn-outline-danger-600 radius-8 px-20 py-11" onClick={() => openDeletePopup(review?.id)}>
                            Delete
                          </button>
                        }
              </div>
            </div>
            <div className="info flex-grow-1">
              <div style={{
                justifyItems: "center"
              }}>
                <div className="card-body py-24 px-16 multiple-carousel dots-style-circle review-slider-container">
                  <ImageGallery
                    lazyLoad={true}
                    showFullscreenButton={true}
                    showPlayButton={false}
                    additionalClass="review-slider"
                    items={review?.reviewAttachments?.map((attachment) => {
                      return {
                        original:
                          Endpoints.BASE_URL.replace("/api","") +
                          attachment.link,
                        thumbnail:
                          Endpoints.BASE_URL.replace("/api","") +
                          attachment.link,
                        
                      };
                    })}
                  />
                </div>

              </div>
              <div className="d-flex row">
                <div className="row mb-10">
                  <div className="col-md-3">
                    <h6 className="text-md">Posted On</h6>
                    <span>{getDateTime(review?.postedDateTime)}</span>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-md">Category</h6>
                    <span>{review?.category?.name}</span>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-md">Sub-category</h6>
                    <span>
                      {review?.subCategory?.name
                        ? review?.subCategory?.name
                        : "N/A"}
                    </span>
                  </div>
                  <div className="col-md-3">
                    <h6 className="text-md">Status</h6>
                    <div className="d-flex gap-10">
                      {review?.status == ReviewStatus.Approved ? (
                        <span className="bg-success-focus text-success-600 border-success-main px-24 py-4 radius-4 fw-medium text-sm">
                          Approved
                        </span>
                      ) : review?.status == ReviewStatus.Pending ? (
                        <span className="bg-warning-focus text-warning-600 border-warning-main px-24 py-4 radius-4 fw-medium text-sm">
                          Pending
                        </span>
                      ) : review?.status == ReviewStatus.Rejected ? (
                        <span className="bg-danger-focus text-danger-600 border-danger-main px-24 py-4 radius-4 fw-medium text-sm">
                          Rejected
                        </span>
                      ) : (
                        <></>
                      )}
                      
                    </div>
                  </div>
                </div>
                <div className="row mb-10">
                  <div className="col-md-12">
                    <h6 className="text-md">Description</h6>
                    <span>{review?.description}</span>
                  </div>
                </div>
                <div className="row mb-10">
                  {review?.link && (
                    <div className="col-md-3">
                      <h6 className="text-md">Reference Link</h6>
                      <span>
                        {review?.link ? (
                          <a
                            className="text-primary"
                            href={
                              review?.link.includes("https")
                                ? review?.link
                                : "https://" + review?.link
                            }
                            target="_blank"
                          >
                            {review?.link}
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </span>
                    </div>
                  )}
                  {review?.location && (
                    <div className="col-md-3">
                      <h6 className="text-md">Location</h6>
                      <span>
                        {review?.location ? (
                          <a
                            className="text-primary"
                            href={
                              "https://www.google.com/maps/search/" +
                              review?.location
                            }
                            target="_blank"
                          >
                            View Map
                          </a>
                        ) : (
                          "N/A"
                        )}
                      </span>
                    </div>
                  )}
                  {review?.status === ReviewStatus.Rejected && (
                    <div className="col-md-3">
                      <>
                        <h6 className="text-md">Rejection Reason</h6>
                        <span>
                          {review?.rejectionReason
                            ? review?.rejectionReason
                            : "N/A"}
                        </span>
                      </>
                    </div>
                  )}
                </div>
                <div className="row mb-24">
                    {review?.userRatings?.length > 0 && <div className="col-md-12 d-flex align-items-end">
                      <div className="col-md-3 mb-10">
                      <h6 className="text-md">Average Rating</h6>
                      <span>{(review?.userRatings?.reduce((a, b) => a + b.value, 0) / review?.userRatings?.length).toFixed(2)}</span>
                    </div>
                    <div className="col-md-6 d-flex justify-content-between align-items-center">
                      {
                        review?.userRatings?.map((rating) => <>
                            <h6 className="text-sm mb-0">{rating?.ratingParameter?.name}</h6>
                            <span className="text-sm">{rating?.value.toFixed(2)}</span>
                        </>)
                      }
                    </div>
                  </div>
                  }

                  
                </div>
                <hr />
                <div className="mt-24 w-30">
                  <h6 className="text-xl mb-16">User Info</h6>
                  <ul>
                    <li className="d-flex align-items-center gap-1 mb-12">
                      <span className="w-30 text-md fw-semibold text-primary-light">
                        Full Name
                      </span>
                      <span className="w-70 text-secondary-light fw-medium">
                        <Link
                          className="text-primary"
                          onClick={(e) => { 
                            e.preventDefault(); 
                            navigatePage(navigate, dispatch, "/view-profile", {state : {userId: review?.user?.id}}); } }>
                          {review?.user?.fullName}
                        </Link>
                      </span>
                    </li>
                    <li className="d-flex align-items-center gap-1 mb-12">
                      <span className="w-30 text-md fw-semibold text-primary-light">
                        {" "}
                        Email
                      </span>
                      <span className="w-70 text-secondary-light fw-medium">
                        {review?.user?.email}
                      </span>
                    </li>
                    <li className="d-flex align-items-center gap-1 mb-12">
                      <span className="w-30 text-md fw-semibold text-primary-light">
                        {" "}
                        Interests
                      </span>
                      <span className="w-70 text-secondary-light fw-medium">
                        {review?.user?.interests?.length > 0
                          ? review?.user?.interests
                              ?.map((x) => x.name)
                              .join(", ")
                          : "N/A"}
                      </span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ReviewDetailsLayer;
