import { useLocation } from "react-router-dom";
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

const ReviewDetailsLayer = () => {
  const { state } = useLocation();
  const permissions = useSelector((state) => state?.auth?.permissions);
  const [selectedReviewId, setSelectedReviewId] = useState(null);
  const [showStatusPopup, setShowStatusPopup] = useState();
  const [popupLoading, setPopupLoading] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [review, setReview] = useState(state);

  const settings = {
    adaptiveHeight: true,
    dots: true,
    arrows: false,
    infinite: false,
    speed: 1200,
    slidesToShow: 3,
    slidesToScroll: 2,
    initialSlide: 0,
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 991,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
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

  const getStatusString = (value) => Object.keys(ReviewStatus).find(key => ReviewStatus[key] === value);

  return ( 
    <>
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
              required />
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
            onClick={() => showStatusPopup == ReviewStatus.Rejected
              ? rejectionReason != "" &&
              handleStatusPopupConfirm(showStatusPopup)
              : handleStatusPopupConfirm(showStatusPopup)}
          >
            <ThreeDots
              height="20"
              width="20"
              radius="5"
              color="#fff"
              ariaLabel="loading"
              wrapperStyle={{ marginRight: 5 }}
              wrapperClass=""
              visible={popupLoading} />
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="col-lg-12">
        <div className="card h-100">
          <div className="card-body p-24">
            <Icon className="icon" icon="" />
            <h6 className="text-xl mb-16">Review Details</h6>
            <div className="info flex-grow-1">
              <div className="card-body py-24 px-16 multiple-carousel dots-style-circle">
                <ImageGallery
                  lazyLoad={true}
                  showFullscreenButton={true}
                  showPlayButton={false}
                  additionalClass="review-slider"
                  items={review?.reviewAttachments?.map((attachment) => {
                    return {
                      original: "https://jeeneapi.rhenoxinnovations.com" +
                        attachment.link,
                      thumbnail: "https://jeeneapi.rhenoxinnovations.com" +
                        attachment.link,
                    };
                  })} />
              </div>
              <div className="d-flex">
                <div className="col-md-6">
                  <h6 className="text-md">Title</h6>
                  <span className="mb-20">{review?.title}</span>
                  <h6 className="text-md">Description</h6>
                  <span className="mb-20">{review?.description}</span>
                  <h6 className="text-md">Reference Link</h6>
                  <span className="mb-20">
                    {review?.link ? <a className="text-primary" href={review?.link.includes("https") ? review?.link : "https://" + review?.link } target="_blank" >{review?.link}</a> : "N/A"}
                  </span>
                  <h6 className="text-md">Status</h6>
                  <div className="d-flex gap-10 mt-20 mb-20">
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
                  
                  {permissions?.includes("/approve-reject-review") &&
                      (review?.status == ReviewStatus.Pending ? (
                        <>
                          <button
                            type="button"
                            className="bg-warning-focus bg-hover-warning-200 text-warning-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={() => openStatusPopup(review?.id, ReviewStatus.Rejected)}
                            title="Reject Review"
                          >
                            <Icon
                              icon="fluent:presence-blocked-24-regular"
                              className="menu-icon" />
                          </button>
                          <button
                            type="button"
                            className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                            onClick={() => openStatusPopup(review?.id, ReviewStatus.Approved)}
                            title="Approve Review"

                          >
                            <Icon icon="fa6-solid:check" className="menu-icon" />
                          </button>
                        </>
                      ) : review?.status == ReviewStatus.Approved ? (
                        <button
                          type="button"
                          className="bg-warning-focus bg-hover-warning-200 text-warning-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => openStatusPopup(review?.id, ReviewStatus.Rejected)}
                          title="Reject Review"

                        >
                          <Icon
                            icon="fluent:presence-blocked-24-regular"
                            className="menu-icon" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="bg-success-focus bg-hover-success-200 text-success-600 fw-medium w-40-px h-40-px d-flex justify-content-center align-items-center rounded-circle"
                          onClick={() => openStatusPopup(review?.id, ReviewStatus.Approved)}
                          title="Approve Review"

                        >
                          <Icon icon="fa6-solid:check" className="menu-icon" />
                        </button>
                      ))}
                  </div>
                  {review?.status == ReviewStatus.Rejected && (
                    <>
                      <h6 className="text-md">Rejection Reason</h6>
                      <span className="mb-20">
                        {review?.rejectionReason ? review?.rejectionReason : "N/A"}
                      </span>
                    </>
                  )}
                </div>
                <div className="col-md-6">
                  <h6 className="text-md">Category</h6>
                  <span className="mb-20">{review?.category?.name}</span>
                  <h6 className="text-md">Sub-category</h6>
                  <span className="mb-20">
                    {review?.subCategory?.name ? review?.subCategory?.name : "N/A"}
                  </span>
                  <h6 className="text-md">Posted On</h6>
                  <span className="mb-20">
                    {new Date(review?.postedDateTime).toDateString() +
                      " " +
                      new Date(review?.postedDateTime).toTimeString()}
                  </span>
                  <h6 className="text-md">Location</h6>
                  <span className="mb-20">
                    {review?.location ? <a className="text-primary" href={"https://www.google.com/maps/search/" + review?.location} target="_blank">View Map</a> : "N/A"}
                  </span>
                  
                </div>
              </div>
              <hr/>
              <div className="mt-24 w-40">
                <h6 className="text-xl mb-16">User Info</h6>
                <ul>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      Full Name
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {review?.user?.fullName}
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
                        ? review?.user?.interests?.map((x) => x.name).join(", ")
                        : "N/A"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      </>);
};

export default ReviewDetailsLayer;
