import React, { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Endpoints } from "../helper/common/Endpoint";
import { Icon } from "@iconify/react/dist/iconify.js";
import Slider from "react-slick";
import { ReviewStatus } from "../helper/common/Enum";

const ReviewDetailsLayer = () => {
  const { state } = useLocation();

  const settings = {
        dots: true,
        arrows: false,
        infinite: false,
        speed: 1200,
        slidesToShow: 4,
        slidesToScroll: 2,
        initialSlide: 0,
        responsive: [
            {
                breakpoint: 1199,
                settings: {
                    slidesToShow: 3,
                }
            },
            {
                breakpoint: 991,
                settings: {
                    slidesToShow: 2,
                }
            },
            {
                breakpoint: 575,
                settings: {
                    slidesToShow: 1,
                }
            },
        ]
  };
 
  return (
    
      <div className="col-lg-12">
          <div className="card h-100">
            <div className="card-body p-24">
              <Icon className="icon" icon=""/>
              <h6 className="text-xl mb-16">Review Details</h6>
               <div className="info flex-grow-1">
                     <div className="card-body py-24 px-16 multiple-carousel dots-style-circle">
                                    <Slider {...settings}>
                                        {
                                            state?.reviewAttachments?.map((attachment, index) =>
                                            <div className="mb-24 h-30 w-30" key={index}>
                                                          <img
                                                              src={Endpoints.BASE_URL.replace("/api","") + attachment.link}
                                                              className="w-100 h-100 object-fit-contain"
                                                              alt=""
                                                          />
                                            </div>
                                            )
                                        }

                                                     
                                    </Slider>
                    </div>
                    <div className="d-flex">
                      <div className="col-md-6">
                      <h6 className="text-md">Title</h6>
                      <span className="mb-20">{state?.title}</span>
                      <h6 className="text-md">Description</h6>
                      <span className="mb-20">{state?.description}</span>
                      <h6 className="text-md">Reference Link</h6>
                      <span className="mb-20">{state?.link ? state?.link : "N/A"}</span>
                       <h6 className="text-md">Status</h6>
                      {state?.status == ReviewStatus.Approved ? (
                        <span className="bg-success-focus text-success-600 border border-success-main px-24 py-4 radius-4 fw-medium text-sm">
                          Approved
                        </span>
                      ) : state?.status == ReviewStatus.Pending ? (
                        <span className="bg-warning-focus text-warning-600 border border-warning-main px-24 py-4 radius-4 fw-medium text-sm">
                          Pending
                        </span>
                      ) : state?.status == ReviewStatus.Rejected ? (
                        <span
                          className="bg-danger-focus text-danger-600 border border-danger-main px-24 py-4 radius-4 fw-medium text-sm"
                        >
                          Rejected
                        </span>
                      ) : (
                        <></>
                      )}
                    </div>
                    <div className="col-md-6">
                       <h6 className="text-md">Category</h6>
                      <span className="mb-20">{state?.category?.name}</span>
                      <h6 className="text-md">Sub-category</h6>
                      <span className="mb-20">{state?.subCategory?.name ? state?.subCategory?.name : "N/A"}</span>
                       <h6 className="text-md">Posted On</h6>
                      <span className="mb-20">{new Date(state?.postedDateTime).toDateString() + " " +new Date(state?.postedDateTime).toTimeString() }</span>
                      <h6 className="text-md">Location</h6>
                      <span className="mb-20">{state?.location ? state?.location : "N/A"}</span>
                      { state?.status == ReviewStatus.Rejected &&
                       <><h6 className="text-md">Rejection Reason</h6>
                        <span className="mb-20">{state?.rejectionReason ? state?.rejectionReason : "N/A"}</span></> 
                      }
                    </div>
                                          
                    </div>
                <div className="mt-24 w-40">
                <h6 className="text-xl mb-16">User Info</h6>
                <ul>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      Full Name
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {state?.user?.fullName}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Email
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {state?.user?.email}
                    </span>
                  </li>
                  <li className="d-flex align-items-center gap-1 mb-12">
                    <span className="w-30 text-md fw-semibold text-primary-light">
                      {" "}
                      Interests
                    </span>
                    <span className="w-70 text-secondary-light fw-medium">
                      {state?.user?.interests?.length > 0
                        ? state?.user?.interests?.map((x) => x.name).join(", ")
                        : "N/A"}
                    </span>
                  </li>
                </ul>
              </div>
                </div>
            </div>
               
            </div>
          </div>
  );
};

export default ReviewDetailsLayer;
