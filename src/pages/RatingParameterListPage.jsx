import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RatingParameterListLayer from "../components/RatingParameterListLayer";

const RatingParameterListPage = () => {
  

  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Rating Parameter List" />

        {/* UsersListLayer */}
        <RatingParameterListLayer />

      </MasterLayout>

    </>
  );
};

export default RatingParameterListPage; 
