import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import ViewProfileLayer from "../components/ViewProfileLayer";


const ViewProfilePageAdmin = () => {
  
  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="View Profile" />

        {/* ViewProfileLayer */}
        <ViewProfileLayer />

      </MasterLayout>

    </>
  );
};

export default ViewProfilePageAdmin; 
