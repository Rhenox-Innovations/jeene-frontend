import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditRatingParameterLayer from "../components/EditRatingParameterLayer";

const EditRatingParameterPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Rating Parameter" />

        {/* AddUserLayer */}
        <EditRatingParameterLayer />


      </MasterLayout>
    </>
  );
};

export default EditRatingParameterPage;
