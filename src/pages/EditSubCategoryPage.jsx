import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditSubCategoryLayer from "../components/EditSubCategoryLayer";

const EditSubCategoryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Category" />

        {/* AddUserLayer */}
        <EditSubCategoryLayer />


      </MasterLayout>
    </>
  );
};

export default EditSubCategoryPage;
