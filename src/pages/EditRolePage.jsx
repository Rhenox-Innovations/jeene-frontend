import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import EditRoleLayer from "../components/EditRoleLayer";

const EditRolePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Edit Role" />

        <EditRoleLayer />


      </MasterLayout>
    </>
  );
};

export default EditRolePage;
