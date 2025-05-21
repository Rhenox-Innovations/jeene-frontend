import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddRatingParameterLayer from "../components/AddRatingParameterLayer";

const AddRatingParameterPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Rating Parameter" />

        {/* AddSubCategoryLayer */}
        <AddRatingParameterLayer />


      </MasterLayout>
    </>
  );
};

export default AddRatingParameterPage;
