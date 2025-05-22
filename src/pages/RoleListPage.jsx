import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import RoleListLayer from "../components/RoleListLayer";

const RoleListPage = () => {
  return (
    <>
      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Roles List" />

        {/* AddUserLayer */}
        <RoleListLayer />


      </MasterLayout>
    </>
  );
};

export default RoleListPage;
