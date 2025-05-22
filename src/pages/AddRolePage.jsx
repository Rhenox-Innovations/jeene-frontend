import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import AddRoleLayer from "../components/AddRoleLayer";

const AddRolePage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Add Role" />

        {/* AddUserLayer */}
        <AddRoleLayer />

      </MasterLayout>
    </>
  );
};

export default AddRolePage;
