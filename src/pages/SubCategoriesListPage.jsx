import React from "react";
import MasterLayout from "../masterLayout/MasterLayout";
import Breadcrumb from "../components/Breadcrumb";
import SubCategoriesListLayer from "../components/SubCategoriesListLayer";


const SubCategoriesListPage = () => {
  

  return (
    <>

      {/* MasterLayout */}
      <MasterLayout>

        {/* Breadcrumb */}
        <Breadcrumb title="Sub-Categories List" />

        {/* UsersListLayer */}
        <SubCategoriesListLayer />

      </MasterLayout>

    </>
  );
};

export default SubCategoriesListPage; 
