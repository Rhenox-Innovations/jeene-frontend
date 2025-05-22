import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditRoleLayer from "../components/EditRoleLayer";

const EditCategoryPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Category" />

        <EditRoleLayer />


      </MasterLayout>
    </>
  );
};

export default EditCategoryPage;
