import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ReviewsListLayer from "../components/ReviewsListLayer";
const ReviewsListPage = () => {
  

  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Reviews List" />

        {/* ReviewsListLayer */}
        <ReviewsListLayer />

      </MasterLayout>

    </>
  );
};

export default ReviewsListPage; 
